-- ============================================
-- SECURE LOGIN: USER EXISTENCE, PASSWORD CHECK, RATE LIMITING
-- ============================================
-- Requirements:
-- - pgcrypto extension enabled for password hashing verification
--   run: CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1) Login attempts table for IP-based throttling
CREATE TABLE IF NOT EXISTS login_attempts (
  id BIGSERIAL PRIMARY KEY,
  username TEXT,
  ip TEXT,
  attempts INTEGER NOT NULL DEFAULT 0,
  locked_until TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_login_attempts_user_ip ON login_attempts(username, ip);

-- 2) Ensure users table has a password hash column
--    Assumes a public.users table with username unique and password_hash stored using crypt
--    (Do not store plaintext passwords.)
ALTER TABLE IF EXISTS users
  ADD COLUMN IF NOT EXISTS password_hash TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- 3) Secure login RPC
-- Inputs: p_username, p_password, p_ip
-- Behavior:
-- - If >6 failed attempts in last window and locked_until in the future, deny with cooldown message
-- - If user not found, return error 'no_user'
-- - If password mismatch, increment attempts and return 'bad_password'
-- - On success, reset attempts and return basic user profile fields

CREATE OR REPLACE FUNCTION secure_login(
  p_username TEXT,
  p_password TEXT,
  p_ip TEXT
)
RETURNS TABLE (success BOOLEAN, error TEXT, user_id UUID, username TEXT) AS $$
DECLARE
  v_attempts RECORD;
  v_user RECORD;
  v_now TIMESTAMPTZ := NOW();
  v_lock_window INTERVAL := INTERVAL '10 minutes';
  v_max_attempts INT := 6;
BEGIN
  -- normalize inputs
  p_username := TRIM(p_username);

  -- read attempts row
  SELECT * INTO v_attempts
  FROM login_attempts
  WHERE username = p_username AND ip = p_ip
  ORDER BY updated_at DESC
  LIMIT 1;

  -- check lock
  IF v_attempts.locked_until IS NOT NULL AND v_attempts.locked_until > v_now THEN
    RETURN QUERY SELECT FALSE, 'cooldown', NULL::UUID, NULL::TEXT;
    RETURN;
  END IF;

  -- find user
  SELECT id, username, password_hash
  INTO v_user
  FROM users
  WHERE username = p_username
  LIMIT 1;

  IF NOT FOUND THEN
    -- record failed attempt and set lock if needed
    IF v_attempts IS NULL THEN
      INSERT INTO login_attempts(username, ip, attempts, locked_until)
      VALUES(p_username, p_ip, 1, NULL);
    ELSE
      UPDATE login_attempts
      SET attempts = v_attempts.attempts + 1,
          locked_until = CASE WHEN v_attempts.attempts + 1 >= v_max_attempts THEN v_now + v_lock_window ELSE NULL END,
          updated_at = v_now
      WHERE id = v_attempts.id;
    END IF;
    RETURN QUERY SELECT FALSE, 'no_user', NULL::UUID, NULL::TEXT;
    RETURN;
  END IF;

  -- verify password using pgcrypto
  IF v_user.password_hash IS NULL OR NOT (crypt(p_password, v_user.password_hash) = v_user.password_hash) THEN
    -- bad password -> increment attempts and lock if necessary
    IF v_attempts IS NULL THEN
      INSERT INTO login_attempts(username, ip, attempts, locked_until)
      VALUES(p_username, p_ip, 1, NULL);
    ELSE
      UPDATE login_attempts
      SET attempts = v_attempts.attempts + 1,
          locked_until = CASE WHEN v_attempts.attempts + 1 >= v_max_attempts THEN v_now + v_lock_window ELSE NULL END,
          updated_at = v_now
      WHERE id = v_attempts.id;
    END IF;
    RETURN QUERY SELECT FALSE, 'bad_password', NULL::UUID, NULL::TEXT;
    RETURN;
  END IF;

  -- success -> reset attempts
  IF v_attempts IS NOT NULL THEN
    UPDATE login_attempts
    SET attempts = 0,
        locked_until = NULL,
        updated_at = v_now
    WHERE id = v_attempts.id;
  END IF;

  RETURN QUERY SELECT TRUE, NULL::TEXT, v_user.id::UUID, v_user.username::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS and permissions
-- Allow calling from anon/public (frontend) safely; function itself guards logic
REVOKE ALL ON FUNCTION secure_login(TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION secure_login(TEXT, TEXT, TEXT) TO anon, authenticated;


