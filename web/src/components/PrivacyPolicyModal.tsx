import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'

interface PrivacyPolicyModalProps {
  open: boolean
  onClose: () => void
}

export default function PrivacyPolicyModal({ open, onClose }: PrivacyPolicyModalProps) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1,
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1E377C' }}>
          Privacy Policy
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
          <Typography variant="body2" sx={{ color: '#666', mb: 3, fontStyle: 'italic' }}>
            Last updated: {new Date().toLocaleDateString()}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E377C', mb: 2 }}>
              1. Information We Collect
            </Typography>
            <Typography variant="body2" sx={{ color: '#333', lineHeight: 1.6, mb: 2 }}>
              BeaverNorth Advisors collects personal information when you:
            </Typography>
            <Box component="ul" sx={{ pl: 2, mb: 2 }}>
              <Typography component="li" variant="body2" sx={{ color: '#333', lineHeight: 1.6, mb: 1 }}>
                Submit insurance quote requests through our website
              </Typography>
              <Typography component="li" variant="body2" sx={{ color: '#333', lineHeight: 1.6, mb: 1 }}>
                Contact us via phone, email, or contact forms
              </Typography>
              <Typography component="li" variant="body2" sx={{ color: '#333', lineHeight: 1.6, mb: 1 }}>
                Register for our services or newsletters
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#333', lineHeight: 1.6 }}>
              This information may include your name, email address, phone number, date of birth, 
              smoking status, insurance preferences, and other details necessary to provide 
              personalized insurance quotes.
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E377C', mb: 2 }}>
              2. How We Use Your Information
            </Typography>
            <Typography variant="body2" sx={{ color: '#333', lineHeight: 1.6, mb: 2 }}>
              We use your personal information to:
            </Typography>
            <Box component="ul" sx={{ pl: 2, mb: 2 }}>
              <Typography component="li" variant="body2" sx={{ color: '#333', lineHeight: 1.6, mb: 1 }}>
                Provide personalized insurance quotes and recommendations
              </Typography>
              <Typography component="li" variant="body2" sx={{ color: '#333', lineHeight: 1.6, mb: 1 }}>
                Connect you with licensed Canadian insurance advisors
              </Typography>
              <Typography component="li" variant="body2" sx={{ color: '#333', lineHeight: 1.6, mb: 1 }}>
                Communicate about your insurance needs and our services
              </Typography>
              <Typography component="li" variant="body2" sx={{ color: '#333', lineHeight: 1.6, mb: 1 }}>
                Improve our website and services
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E377C', mb: 2 }}>
              3. Phone Verification (OTP)
            </Typography>
            <Typography variant="body2" sx={{ color: '#333', lineHeight: 1.6, mb: 2 }}>
              To ensure the security and validity of your quote requests, we use SMS-based 
              One-Time Password (OTP) verification through Twilio. This process:
            </Typography>
            <Box component="ul" sx={{ pl: 2, mb: 2 }}>
              <Typography component="li" variant="body2" sx={{ color: '#333', lineHeight: 1.6, mb: 1 }}>
                Verifies that you have access to the phone number provided
              </Typography>
              <Typography component="li" variant="body2" sx={{ color: '#333', lineHeight: 1.6, mb: 1 }}>
                Helps prevent fraudulent quote requests
              </Typography>
              <Typography component="li" variant="body2" sx={{ color: '#333', lineHeight: 1.6, mb: 1 }}>
                Ensures our advisors can reach you with accurate quotes
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#333', lineHeight: 1.6 }}>
              OTP codes are sent via SMS and expire after a short period. We do not store 
              OTP codes or use them for any purpose other than verification.
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E377C', mb: 2 }}>
              4. Information Sharing
            </Typography>
            <Typography variant="body2" sx={{ color: '#333', lineHeight: 1.6, mb: 2 }}>
              We may share your information with:
            </Typography>
            <Box component="ul" sx={{ pl: 2, mb: 2 }}>
              <Typography component="li" variant="body2" sx={{ color: '#333', lineHeight: 1.6, mb: 1 }}>
                Licensed Canadian insurance advisors and brokers
              </Typography>
              <Typography component="li" variant="body2" sx={{ color: '#333', lineHeight: 1.6, mb: 1 }}>
                Insurance companies to obtain quotes
              </Typography>
              <Typography component="li" variant="body2" sx={{ color: '#333', lineHeight: 1.6, mb: 1 }}>
                Service providers who assist in our operations (with strict confidentiality agreements)
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#333', lineHeight: 1.6 }}>
              We do not sell, rent, or trade your personal information to third parties for 
              marketing purposes.
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E377C', mb: 2 }}>
              5. Data Security
            </Typography>
            <Typography variant="body2" sx={{ color: '#333', lineHeight: 1.6, mb: 2 }}>
              We implement appropriate security measures to protect your personal information:
            </Typography>
            <Box component="ul" sx={{ pl: 2, mb: 2 }}>
              <Typography component="li" variant="body2" sx={{ color: '#333', lineHeight: 1.6, mb: 1 }}>
                Secure data transmission using SSL encryption
              </Typography>
              <Typography component="li" variant="body2" sx={{ color: '#333', lineHeight: 1.6, mb: 1 }}>
                Protected database storage with access controls
              </Typography>
              <Typography component="li" variant="body2" sx={{ color: '#333', lineHeight: 1.6, mb: 1 }}>
                Regular security updates and monitoring
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E377C', mb: 2 }}>
              6. Your Rights
            </Typography>
            <Typography variant="body2" sx={{ color: '#333', lineHeight: 1.6, mb: 2 }}>
              Under Canadian privacy laws, you have the right to:
            </Typography>
            <Box component="ul" sx={{ pl: 2, mb: 2 }}>
              <Typography component="li" variant="body2" sx={{ color: '#333', lineHeight: 1.6, mb: 1 }}>
                Access your personal information we hold
              </Typography>
              <Typography component="li" variant="body2" sx={{ color: '#333', lineHeight: 1.6, mb: 1 }}>
                Request correction of inaccurate information
              </Typography>
              <Typography component="li" variant="body2" sx={{ color: '#333', lineHeight: 1.6, mb: 1 }}>
                Request deletion of your personal information
              </Typography>
              <Typography component="li" variant="body2" sx={{ color: '#333', lineHeight: 1.6, mb: 1 }}>
                Withdraw consent for data processing
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E377C', mb: 2 }}>
              7. Contact Information
            </Typography>
            <Typography variant="body2" sx={{ color: '#333', lineHeight: 1.6, mb: 2 }}>
              If you have questions about this Privacy Policy or wish to exercise your rights, 
              please contact us:
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography variant="body2" sx={{ color: '#333', lineHeight: 1.6, mb: 1 }}>
                <strong>Email:</strong> beavernorthadvisors@gmail.com
              </Typography>
              <Typography variant="body2" sx={{ color: '#333', lineHeight: 1.6, mb: 1 }}>
                <strong>Phone:</strong> (438) 763-5120
              </Typography>
              <Typography variant="body2" sx={{ color: '#333', lineHeight: 1.6 }}>
                <strong>Address:</strong> Montreal, Quebec, Canada
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E377C', mb: 2 }}>
              8. Changes to This Policy
            </Typography>
            <Typography variant="body2" sx={{ color: '#333', lineHeight: 1.6 }}>
              We may update this Privacy Policy from time to time. We will notify you of any 
              significant changes by posting the new policy on our website and updating the 
              "Last updated" date. Your continued use of our services after any changes 
              constitutes acceptance of the updated policy.
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 1, borderTop: '1px solid #e0e0e0' }}>
        <Button 
          onClick={onClose} 
          variant="contained"
          sx={{ 
            backgroundColor: '#1E377C',
            '&:hover': { backgroundColor: '#417F73' }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
