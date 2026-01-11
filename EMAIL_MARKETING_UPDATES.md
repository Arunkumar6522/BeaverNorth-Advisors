# Email Marketing Updates Required

## 1. Fix Image Resize in RichTextEditor

In `RichTextEditor.tsx`, update the `handleResizeImage` function to ensure images fit the canvas:

```typescript
const handleResizeImage = () => {
  if (!selectedImage) return

  const width = imageWidth ? (imageWidth.includes('%') ? imageWidth : imageWidth + 'px') : 'auto'
  const height = imageHeight ? (imageHeight.includes('%') ? imageHeight : imageHeight + 'px') : 'auto'

  selectedImage.style.width = width
  selectedImage.style.height = height === 'auto' ? 'auto' : height
  selectedImage.style.maxWidth = '100%'
  selectedImage.style.objectFit = 'contain' // Ensure image fits within bounds

  // Update link if provided
  if (imageLink) {
    handleAddImageLink()
  }

  updateContent()
  setResizeDialogOpen(false)
  setSelectedImage(null)
  setImageLink('')
}
```

## 2. Add Unsubscribe Button to Templates

In `EmailMarketing.tsx`, when saving templates, automatically add unsubscribe button:

```typescript
import { addUnsubscribeButton } from '../utils/emailHelpers'

const handleSaveTemplate = () => {
  if (!templateName.trim() || !templateContent.trim()) {
    alert('Please fill in both name and content')
    return
  }

  // Add unsubscribe button if not present
  const contentWithUnsubscribe = addUnsubscribeButton(templateContent)

  if (editingTemplate) {
    setTemplates(templates.map(t => 
      t.id === editingTemplate.id 
        ? { ...t, name: templateName, content: contentWithUnsubscribe }
        : t
    ))
  } else {
    const newTemplate: EmailTemplate = {
      id: Date.now().toString(),
      name: templateName,
      content: contentWithUnsubscribe,
      createdAt: new Date().toISOString()
    }
    setTemplates([...templates, newTemplate])
  }
  // ... rest of function
}
```

## 3. Add Unsubscribers Tab

Add a new tab in EmailMarketing component:

```typescript
// Add to tabs
<Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
  <Tab label="Email Templates" />
  <Tab label="Categories" />
  <Tab label="Tracking" />
  <Tab label="Unsubscribers" />
</Tabs>

// Add state
const [unsubscribers, setUnsubscribers] = useState<Unsubscriber[]>([])

// Add useEffect to load unsubscribers
useEffect(() => {
  const loadUnsubscribers = async () => {
    const data = await fetchUnsubscribers()
    setUnsubscribers(data)
  }
  loadUnsubscribers()
}, [])

// Add Unsubscribers Tab (activeTab === 3)
{activeTab === 3 && (
  <Box>
    <Card sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Unsubscribers ({unsubscribers.length})
        </Typography>
        <TextField
          size="small"
          placeholder="Search by email..."
          onChange={(e) => {
            // Filter unsubscribers
          }}
        />
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Unsubscribed At</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Reason</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {unsubscribers.map((unsub) => (
              <TableRow key={unsub.id}>
                <TableCell>{unsub.email}</TableCell>
                <TableCell>{unsub.name || '-'}</TableCell>
                <TableCell>{unsub.category_name || '-'}</TableCell>
                <TableCell>{formatDate(unsub.unsubscribed_at)}</TableCell>
                <TableCell>{unsub.reason || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  </Box>
)}
```

## 4. Backend Email Sending (After AWS SES Approval)

Create `web/netlify/functions/send-email-campaign.js`:

```javascript
const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  // AWS SES transporter setup
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  // Send email logic
  // Check unsubscribers before sending
  // Track delivery status
  // Handle bounces
};
```

## 5. Filter Unsubscribed Emails Before Sending

When sending emails, filter out unsubscribed addresses:

```typescript
const handleSendEmail = async () => {
  // ... existing code ...
  
  // Filter out unsubscribed emails
  const unsubscribedEmails = unsubscribers.map(u => u.email.toLowerCase())
  const validContacts = category.contacts.filter(
    contact => !unsubscribedEmails.includes(contact.email.toLowerCase())
  )
  
  if (validContacts.length === 0) {
    alert('All contacts in this category have unsubscribed')
    return
  }
  
  // Continue with sending to validContacts only
}
```
