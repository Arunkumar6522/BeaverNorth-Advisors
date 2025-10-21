-- STEP 2: Create secure login function
-- This function allows login verification without exposing passwords

CREATE OR REPLACE FUNCTION secure_user_login(
  p_username TEXT,
  p_password TEXT,
  p_ip_address TEXT DEFAULT NULL
)
RETURNS TABLE (
  user_id INTEGER,
  username TEXT,
  email TEXT,
  role TEXT,
  success BOOLEAN,
  message TEXT
) AS $$
DECLARE
  v_user RECORD;
  v_success BOOLEAN := FALSE;
  v_message TEXT := 'Login failed';
BEGIN
  -- Get user data
  SELECT * INTO v_user
  FROM users
  WHERE username = p_username
  LIMIT 1;

  -- Check if user exists and password is correct
  IF v_user.id IS NOT NULL AND crypt(p_password, v_user.password_hash) = v_user.password_hash THEN
    v_success := TRUE;
    v_message := 'Login successful';
  END IF;

  -- Return result
  IF v_success THEN
    RETURN QUERY
    SELECT 
      v_user.id,
      v_user.username,
      v_user.email,
      v_user.role,
      v_success,
      v_message;
  ELSE
    RETURN QUERY
    SELECT 
      NULL::INTEGER,
      NULL::TEXT,
      NULL::TEXT,
      NULL::TEXT,
      v_success,
      v_message;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to anonymous users
GRANT EXECUTE ON FUNCTION secure_user_login(TEXT, TEXT, TEXT) TO anon;
