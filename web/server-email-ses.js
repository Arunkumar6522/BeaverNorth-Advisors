// AWS SES Email Sending Module
// Add this to your server.js when AWS SES is approved

const AWS = require('aws-sdk');

// Initialize SES client
let ses = null;

function initializeSES() {
  const region = process.env.AWS_SES_REGION || 'us-east-1';
  const accessKeyId = process.env.AWS_SES_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SES_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretAccessKey) {
    console.log('⚠️ AWS SES credentials not configured. Email sending will use fallback method.');
    return null;
  }

  ses = new AWS.SES({
    region: region,
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
  });

  console.log('✅ AWS SES initialized successfully');
  return ses;
}

// Send email via AWS SES
async function sendEmailViaSES(to, subject, htmlContent, fromEmail = null) {
  if (!ses) {
    throw new Error('AWS SES not initialized');
  }

  const from = fromEmail || process.env.AWS_SES_FROM_EMAIL || 'noreply@beavernorthadvisors.com';

  const params = {
    Source: from,
    Destination: {
      ToAddresses: Array.isArray(to) ? to : [to]
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: 'UTF-8'
      },
      Body: {
        Html: {
          Data: htmlContent,
          Charset: 'UTF-8'
        },
        Text: {
          Data: htmlContent.replace(/<[^>]*>/g, ''), // Strip HTML for text version
          Charset: 'UTF-8'
        }
      }
    },
    // Configuration set for tracking (optional)
    ConfigurationSetName: process.env.AWS_SES_CONFIGURATION_SET || undefined
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log('✅ Email sent via SES:', result.MessageId);
    return {
      success: true,
      messageId: result.MessageId,
      provider: 'AWS SES'
    };
  } catch (error) {
    console.error('❌ SES send error:', error);
    throw error;
  }
}

// Send bulk emails via SES (for campaigns)
async function sendBulkEmailViaSES(emails) {
  if (!ses) {
    throw new Error('AWS SES not initialized');
  }

  const from = process.env.AWS_SES_FROM_EMAIL || 'noreply@beavernorthadvisors.com';
  const results = [];

  // SES allows up to 50 recipients per sendEmail call
  const BATCH_SIZE = 50;

  for (let i = 0; i < emails.length; i += BATCH_SIZE) {
    const batch = emails.slice(i, i + BATCH_SIZE);
    
    const params = {
      Source: from,
      Destination: {
        ToAddresses: batch.map(e => e.to)
      },
      Message: {
        Subject: {
          Data: batch[0].subject,
          Charset: 'UTF-8'
        },
        Body: {
          Html: {
            Data: batch[0].html,
            Charset: 'UTF-8'
          }
        }
      }
    };

    try {
      const result = await ses.sendEmail(params).promise();
      batch.forEach((email, index) => {
        results.push({
          email: email.to,
          success: true,
          messageId: result.MessageId,
          provider: 'AWS SES'
        });
      });
    } catch (error) {
      console.error('❌ SES batch send error:', error);
      batch.forEach(email => {
        results.push({
          email: email.to,
          success: false,
          error: error.message,
          provider: 'AWS SES'
        });
      });
    }

    // Rate limiting: SES allows 14 emails per second
    if (i + BATCH_SIZE < emails.length) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between batches
    }
  }

  return results;
}

// Verify email address (for testing)
async function verifyEmailAddress(email) {
  if (!ses) {
    throw new Error('AWS SES not initialized');
  }

  const params = {
    EmailAddress: email
  };

  try {
    await ses.verifyEmailIdentity(params).promise();
    console.log(`✅ Verification email sent to ${email}`);
    return { success: true, message: 'Verification email sent' };
  } catch (error) {
    console.error('❌ Email verification error:', error);
    throw error;
  }
}

// Get sending statistics
async function getSendingStatistics() {
  if (!ses) {
    throw new Error('AWS SES not initialized');
  }

  try {
    const result = await ses.getSendStatistics().promise();
    return result.SendDataPoints;
  } catch (error) {
    console.error('❌ Error getting SES statistics:', error);
    throw error;
  }
}

module.exports = {
  initializeSES,
  sendEmailViaSES,
  sendBulkEmailViaSES,
  verifyEmailAddress,
  getSendingStatistics
};

