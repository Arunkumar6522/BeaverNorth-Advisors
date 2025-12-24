import { useRef, useState, useEffect } from 'react'
import {
  Box,
  IconButton,
  Toolbar,
  Divider,
  Button,
  Popover,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Checkbox,
  FormControlLabel
} from '@mui/material'
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  InsertPhoto,
  Link as LinkIcon,
  Undo,
  Redo,
  FormatColorText,
  FormatColorFill,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  FormatSize,
  FormatStrikethrough,
  FormatClear,
  AspectRatio,
  Crop,
  Title as TitleIcon,
  Draw
} from '@mui/icons-material'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder = 'Enter your email content here...' }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [colorAnchor, setColorAnchor] = useState<HTMLButtonElement | null>(null)
  const [bgColorAnchor, setBgColorAnchor] = useState<HTMLButtonElement | null>(null)
  const [fontSizeAnchor, setFontSizeAnchor] = useState<HTMLButtonElement | null>(null)
  // We only need setters for these – values themselves are not read
  const [, setTextColor] = useState('#000000')
  const [, setBgColor] = useState('#FFFFFF')
  const [, setFontSize] = useState('16px')
  
  // Image resize/crop dialog state
  const [resizeDialogOpen, setResizeDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null)
  const [imageWidth, setImageWidth] = useState<string>('')
  const [imageHeight, setImageHeight] = useState<string>('')
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true)
  const [originalAspectRatio, setOriginalAspectRatio] = useState(1)
  const [imageLink, setImageLink] = useState<string>('')
  const [cropMode, setCropMode] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    updateContent()
  }

  const updateContent = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const insertImageWithStyles = (imageUrl: string) => {
    if (!editorRef.current) return
    
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const img = document.createElement('img')
      img.src = imageUrl
      img.style.maxWidth = '100%'
      img.style.height = 'auto'
      img.style.cursor = 'pointer'
      img.style.border = '2px dashed transparent'
      img.style.transition = 'border-color 0.2s'
      
      // Prevent link navigation in editor
      img.onclick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        handleImageClick(e as any)
      }
      
      // Add hover effect via inline style (will be handled by CSS)
      img.onmouseenter = () => {
        img.style.borderColor = '#1E377C'
        img.style.opacity = '0.9'
      }
      img.onmouseleave = () => {
        img.style.borderColor = 'transparent'
        img.style.opacity = '1'
      }
      
      range.insertNode(img)
      updateContent()
      editorRef.current.focus()
    } else {
      // Fallback to execCommand
      execCommand('insertImage', imageUrl)
      // Apply styles after a short delay
      setTimeout(() => {
        const images = editorRef.current?.querySelectorAll('img')
        images?.forEach(img => {
          img.style.maxWidth = '100%'
          img.style.height = 'auto'
          img.style.cursor = 'pointer'
          // Prevent link navigation
          img.onclick = (e) => {
            e.preventDefault()
            e.stopPropagation()
            handleImageClick(e as any)
          }
        })
        updateContent()
      }, 100)
    }
  }
  
  // Prevent link clicks on images in editor
  useEffect(() => {
    if (!editorRef.current) return
    
    const editor = editorRef.current
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'IMG' || (target.tagName === 'A' && target.querySelector('img'))) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    
    editor.addEventListener('click', handleLinkClick, true)
    
    return () => {
      editor.removeEventListener('click', handleLinkClick, true)
    }
  }, [value])

  const handleImageUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const imageUrl = event.target?.result as string
          insertImageWithStyles(imageUrl)
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const handleImageUrl = () => {
    const url = prompt('Enter image URL:')
    if (url) {
      insertImageWithStyles(url)
    }
  }

  const handleLink = () => {
    const url = prompt('Enter URL:')
    if (url) {
      execCommand('createLink', url)
    }
  }

  const handleTextColor = (color: string) => {
    setTextColor(color)
    execCommand('foreColor', color)
    setColorAnchor(null)
  }

  const handleBgColor = (color: string) => {
    setBgColor(color)
    execCommand('backColor', color)
    setBgColorAnchor(null)
  }

  const handleFontSize = (size: string) => {
    setFontSize(size)
    execCommand('fontSize', '3') // This sets a base size, we'll use CSS for actual sizing
    if (editorRef.current) {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const span = document.createElement('span')
        span.style.fontSize = size
        try {
          range.surroundContents(span)
        } catch (e) {
          // If surroundContents fails, insert the span
          span.appendChild(range.extractContents())
          range.insertNode(span)
        }
        updateContent()
      }
    }
    setFontSizeAnchor(null)
  }

  const handleHeading = (level: number) => {
    execCommand('formatBlock', `h${level}`)
  }

  const handleImageClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.tagName === 'IMG') {
      e.preventDefault()
      e.stopPropagation()
      const img = target as HTMLImageElement
      setSelectedImage(img)
      const currentWidth = img.style.width || img.width.toString() + 'px'
      const currentHeight = img.style.height || img.height.toString() + 'px'
      setImageWidth(currentWidth.replace('px', '').replace('%', ''))
      setImageHeight(currentHeight.replace('px', '').replace('%', ''))
      setOriginalAspectRatio(img.naturalWidth / img.naturalHeight)
      
      // Check if image has a link
      const parent = img.parentElement
      if (parent && parent.tagName === 'A') {
        setImageLink(parent.getAttribute('href') || '')
      } else {
        setImageLink('')
      }
      
      setCropMode(false)
      setResizeDialogOpen(true)
    }
  }
  
  const handleImageMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.tagName === 'IMG') {
      e.preventDefault()
      e.stopPropagation()
    }
  }
  
  const handleInsertSignature = () => {
    if (!editorRef.current) return
    
    const baseUrl = window.location.origin
    const signature = `
      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
        <p style="margin: 0; color: #6B7280; font-size: 14px;">Best regards,</p>
        <p style="margin: 5px 0 0 0; color: #111827; font-weight: 600;">BeaverNorth Financials</p>
        <p style="margin: 5px 0 0 0; color: #6B7280; font-size: 12px;">Email: beavernorthadvisors@gmail.com</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #E5E7EB;">
        <p style="font-size: 12px; color: #6B7280; text-align: center;">
          <a href="${baseUrl}/api/unsubscribe?email={email}" style="color: #6B7280; text-decoration: underline;">Unsubscribe</a> | 
          <a href="${baseUrl}" style="color: #6B7280; text-decoration: underline;">Visit Website</a>
        </p>
        <p style="font-size: 11px; color: #9CA3AF; text-align: center; margin-top: 5px;">
          You are receiving this email because you subscribed to our mailing list. 
          Click <a href="${baseUrl}/api/unsubscribe?email={email}" style="color: #9CA3AF;">here</a> to unsubscribe.
        </p>
      </div>
    `
    
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const div = document.createElement('div')
      div.innerHTML = signature.trim()
      range.insertNode(div)
      updateContent()
      editorRef.current.focus()
    } else {
      editorRef.current.innerHTML += signature
      updateContent()
    }
  }
  
  const handleInsertUnsubscribe = () => {
    if (!editorRef.current) return
    
    // Get the base URL from window location
    const baseUrl = window.location.origin
    const unsubscribeHtml = `
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB; text-align: center;">
        <p style="margin: 0; color: #9CA3AF; font-size: 12px;">
          Don't want to receive these emails? 
          <a href="${baseUrl}/api/unsubscribe?email={email}" style="color: #6B7280; text-decoration: underline;">Unsubscribe here</a>
        </p>
      </div>
    `
    
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const div = document.createElement('div')
      div.innerHTML = unsubscribeHtml.trim()
      range.insertNode(div)
      updateContent()
      editorRef.current.focus()
    } else {
      editorRef.current.innerHTML += unsubscribeHtml
      updateContent()
    }
  }
  
  const handleCropImage = () => {
    if (!selectedImage || !canvasRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // For now, we'll do a simple crop - in a full implementation, you'd use a crop library
    // This is a simplified version that crops to center
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const cropWidth = Math.min(img.width, parseInt(imageWidth) || img.width)
      const cropHeight = Math.min(img.height, parseInt(imageHeight) || img.height)
      const cropX = (img.width - cropWidth) / 2
      const cropY = (img.height - cropHeight) / 2
      
      canvas.width = cropWidth
      canvas.height = cropHeight
      ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight)
      
      const croppedDataUrl = canvas.toDataURL('image/png')
      selectedImage.src = croppedDataUrl
      updateContent()
    }
    img.src = selectedImage.src
  }
  
  const handleAddImageLink = () => {
    if (!selectedImage) return
    
    const url = imageLink || prompt('Enter link URL for image:')
    if (url) {
      const parent = selectedImage.parentElement
      if (parent && parent.tagName === 'A') {
        parent.setAttribute('href', url)
      } else {
        const link = document.createElement('a')
        link.href = url
        link.target = '_blank'
        link.rel = 'noopener noreferrer'
        selectedImage.parentNode?.insertBefore(link, selectedImage)
        link.appendChild(selectedImage)
      }
      setImageLink(url)
      updateContent()
    }
  }

  const handleResizeImage = () => {
    if (!selectedImage) return

    // Get editor width to fit image
    const editorWidth = editorRef.current?.clientWidth || 600
    const maxWidth = editorWidth - 40 // Account for padding
    
    let width = imageWidth ? (imageWidth.includes('%') ? imageWidth : imageWidth + 'px') : 'auto'
    const height = imageHeight ? (imageHeight.includes('%') ? imageHeight : imageHeight + 'px') : 'auto'

    // If width is in pixels and exceeds editor width, scale it down
    if (width !== 'auto' && !width.includes('%')) {
      const widthValue = parseFloat(width.replace('px', ''))
      if (widthValue > maxWidth) {
        width = maxWidth + 'px'
        if (maintainAspectRatio && selectedImage.naturalWidth) {
          const aspectRatio = selectedImage.naturalHeight / selectedImage.naturalWidth
          setImageHeight((maxWidth * aspectRatio).toFixed(0))
        }
      }
    }

    selectedImage.style.width = width
    selectedImage.style.height = height
    selectedImage.style.maxWidth = '100%'
    selectedImage.style.height = height === 'auto' ? 'auto' : height

    // Update link if provided
    if (imageLink) {
      handleAddImageLink()
    }

    updateContent()
    setResizeDialogOpen(false)
    setSelectedImage(null)
    setImageLink('')
  }

  const handleWidthChange = (newWidth: string) => {
    setImageWidth(newWidth)
    if (maintainAspectRatio && selectedImage && newWidth) {
      const widthValue = parseFloat(newWidth)
      if (!isNaN(widthValue)) {
        const newHeight = (widthValue / originalAspectRatio).toFixed(0)
        setImageHeight(newHeight)
      }
    }
  }

  const handleHeightChange = (newHeight: string) => {
    setImageHeight(newHeight)
    if (maintainAspectRatio && selectedImage && newHeight) {
      const heightValue = parseFloat(newHeight)
      if (!isNaN(heightValue)) {
        const newWidth = (heightValue * originalAspectRatio).toFixed(0)
        setImageWidth(newWidth)
      }
    }
  }

  const applyPresetSize = (preset: 'small' | 'medium' | 'large' | 'full') => {
    if (!selectedImage) return

    const presets = {
      small: { width: '200px', height: 'auto' },
      medium: { width: '400px', height: 'auto' },
      large: { width: '600px', height: 'auto' },
      full: { width: '100%', height: 'auto' }
    }

    const presetSize = presets[preset]
    setImageWidth(presetSize.width.replace('px', '').replace('%', ''))
    setImageHeight(presetSize.height === 'auto' ? '' : presetSize.height.replace('px', ''))
    
    if (preset === 'full') {
      setImageWidth('100')
    }
  }

  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#800000', '#008000', '#000080', '#808000', '#800080', '#008080', '#C0C0C0', '#808080',
    '#FFA500', '#FFC0CB', '#A52A2A', '#FFD700', '#4B0082', '#9400D3', '#00CED1', '#32CD32'
  ]

  const fontSizes = ['8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px']

  return (
    <Box sx={{ border: '1px solid #E5E7EB', borderRadius: 1, overflow: 'hidden' }}>
      {/* Toolbar */}
      <Toolbar
        variant="dense"
        sx={{
          bgcolor: '#F9FAFB',
          borderBottom: '1px solid #E5E7EB',
          minHeight: '48px !important',
          gap: 0.5,
          flexWrap: 'wrap'
        }}
      >
        {/* Text Formatting */}
        <IconButton size="small" onClick={() => execCommand('bold')} title="Bold">
          <FormatBold fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => execCommand('italic')} title="Italic">
          <FormatItalic fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => execCommand('underline')} title="Underline">
          <FormatUnderlined fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => execCommand('strikeThrough')} title="Strikethrough">
          <FormatStrikethrough fontSize="small" />
        </IconButton>
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        
        {/* Text Color */}
        <IconButton 
          size="small" 
          onClick={(e) => setColorAnchor(e.currentTarget)} 
          title="Text Color"
        >
          <FormatColorText fontSize="small" />
        </IconButton>
        
        {/* Background Color */}
        <IconButton 
          size="small" 
          onClick={(e) => setBgColorAnchor(e.currentTarget)} 
          title="Background Color"
        >
          <FormatColorFill fontSize="small" />
        </IconButton>
        
        {/* Font Size */}
        <IconButton 
          size="small" 
          onClick={(e) => setFontSizeAnchor(e.currentTarget)} 
          title="Font Size"
        >
          <FormatSize fontSize="small" />
        </IconButton>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        
        {/* Alignment */}
        <IconButton size="small" onClick={() => execCommand('justifyLeft')} title="Align Left">
          <FormatAlignLeft fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => execCommand('justifyCenter')} title="Align Center">
          <FormatAlignCenter fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => execCommand('justifyRight')} title="Align Right">
          <FormatAlignRight fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => execCommand('justifyFull')} title="Justify">
          <FormatAlignJustify fontSize="small" />
        </IconButton>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        
        {/* Lists */}
        <IconButton size="small" onClick={() => execCommand('insertUnorderedList')} title="Bullet List">
          <FormatListBulleted fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => execCommand('insertOrderedList')} title="Numbered List">
          <FormatListNumbered fontSize="small" />
        </IconButton>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        
        {/* Heading 1 only */}
        <IconButton size="small" onClick={() => handleHeading(1)} title="Heading">
          <TitleIcon fontSize="small" />
        </IconButton>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        
        {/* Media & Links */}
        <IconButton size="small" onClick={handleImageUpload} title="Upload Image">
          <InsertPhoto fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={handleImageUrl} title="Insert Image URL">
          <InsertPhoto fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={handleLink} title="Insert Link">
          <LinkIcon fontSize="small" />
        </IconButton>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        
        {/* Signature */}
        <IconButton size="small" onClick={handleInsertSignature} title="Insert Signature">
          <Draw fontSize="small" />
        </IconButton>
        
        {/* Unsubscribe */}
        <IconButton size="small" onClick={handleInsertUnsubscribe} title="Insert Unsubscribe Link">
          <LinkIcon fontSize="small" />
        </IconButton>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        
        {/* Undo/Redo */}
        <IconButton size="small" onClick={() => execCommand('undo')} title="Undo">
          <Undo fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => execCommand('redo')} title="Redo">
          <Redo fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => execCommand('removeFormat')} title="Clear Formatting">
          <FormatClear fontSize="small" />
        </IconButton>
      </Toolbar>
      
      {/* Color Picker Popovers */}
      <Popover
        open={Boolean(colorAnchor)}
        anchorEl={colorAnchor}
        onClose={() => setColorAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 1, width: 200 }}>
          {colors.map((color) => (
            <Box
              key={color}
              onClick={() => handleTextColor(color)}
              sx={{
                width: 30,
                height: 30,
                bgcolor: color,
                border: '1px solid #E5E7EB',
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': { border: '2px solid #1E377C' }
              }}
            />
          ))}
        </Box>
      </Popover>
      
      <Popover
        open={Boolean(bgColorAnchor)}
        anchorEl={bgColorAnchor}
        onClose={() => setBgColorAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 1, width: 200 }}>
          {colors.map((color) => (
            <Box
              key={color}
              onClick={() => handleBgColor(color)}
              sx={{
                width: 30,
                height: 30,
                bgcolor: color,
                border: '1px solid #E5E7EB',
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': { border: '2px solid #1E377C' }
              }}
            />
          ))}
        </Box>
      </Popover>
      
      <Popover
        open={Boolean(fontSizeAnchor)}
        anchorEl={fontSizeAnchor}
        onClose={() => setFontSizeAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 1, minWidth: 120 }}>
          {fontSizes.map((size) => (
            <MenuItem
              key={size}
              onClick={() => handleFontSize(size)}
              sx={{ fontSize: size }}
            >
              {size}
            </MenuItem>
          ))}
        </Box>
      </Popover>

      {/* Editor */}
      <Box
        ref={editorRef}
        contentEditable
        onInput={updateContent}
        onClick={handleImageClick}
        onMouseDown={handleImageMouseDown}
        dangerouslySetInnerHTML={{ __html: value }}
        sx={{
          minHeight: 300,
          maxHeight: 500,
          overflow: 'auto',
          p: 2,
          outline: 'none',
          '&:empty:before': {
            content: `"${placeholder}"`,
            color: '#9CA3AF',
            pointerEvents: 'none'
          },
          '& img': {
            maxWidth: '100%',
            height: 'auto',
            cursor: 'pointer',
            border: '2px dashed transparent',
            transition: 'border-color 0.2s',
            pointerEvents: 'auto',
            display: 'block',
            '&:hover': {
              borderColor: '#1E377C',
              opacity: 0.9
            }
          },
          '& a img': {
            pointerEvents: 'auto',
            '&:hover': {
              borderColor: '#1E377C !important'
            }
          },
          '& a': {
            '&:has(img)': {
              pointerEvents: 'none !important'
            }
          }
        }}
      />

      {/* Image Resize/Crop Dialog */}
      <Dialog open={resizeDialogOpen} onClose={() => setResizeDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AspectRatio />
            Resize & Crop Image
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedImage && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ mb: 3, textAlign: 'center' }}>
                <img
                  src={selectedImage.src}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: 300,
                    border: '1px solid #E5E7EB',
                    borderRadius: 4
                  }}
                />
              </Box>

              {/* Tabs for Resize/Crop */}
              <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
                <Button
                  variant={!cropMode ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setCropMode(false)}
                  startIcon={<AspectRatio />}
                >
                  Resize
                </Button>
                <Button
                  variant={cropMode ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setCropMode(true)}
                  startIcon={<Crop />}
                >
                  Crop
                </Button>
              </Box>

              {!cropMode ? (
                <>
                  <Typography variant="body2" sx={{ mb: 2, fontWeight: 600, color: '#6B7280' }}>
                    Preset Sizes
                  </Typography>
                  <Box
                    sx={{
                      mb: 3,
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                      gap: 1
                    }}
                  >
                    <Box>
                      <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        onClick={() => applyPresetSize('small')}
                      >
                        Small
                      </Button>
                    </Box>
                    <Box>
                      <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        onClick={() => applyPresetSize('medium')}
                      >
                        Medium
                      </Button>
                    </Box>
                    <Box>
                      <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        onClick={() => applyPresetSize('large')}
                      >
                        Large
                      </Button>
                    </Box>
                    <Box>
                      <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        onClick={() => applyPresetSize('full')}
                      >
                        Full Width
                      </Button>
                    </Box>
                  </Box>

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={maintainAspectRatio}
                        onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                      />
                    }
                    label="Maintain Aspect Ratio"
                    sx={{ mb: 2 }}
                  />

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                      gap: 2
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Width"
                      value={imageWidth}
                      onChange={(e) => handleWidthChange(e.target.value)}
                      placeholder="e.g., 500 or 100"
                      helperText="Enter pixels (e.g., 500) or percentage (e.g., 100)"
                    />
                    <TextField
                      fullWidth
                      label="Height"
                      value={imageHeight}
                      onChange={(e) => handleHeightChange(e.target.value)}
                      placeholder="e.g., 300 or auto"
                      helperText="Enter pixels (e.g., 300) or leave empty for auto"
                    />
                  </Box>
                </>
              ) : (
                <>
                  <Typography variant="body2" sx={{ mb: 2, fontWeight: 600, color: '#6B7280' }}>
                    Crop Image
                  </Typography>
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                      gap: 2,
                      mb: 2
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Crop Width"
                      value={imageWidth}
                      onChange={(e) => setImageWidth(e.target.value)}
                      placeholder="e.g., 500"
                      helperText="Width in pixels"
                    />
                    <TextField
                      fullWidth
                      label="Crop Height"
                      value={imageHeight}
                      onChange={(e) => setImageHeight(e.target.value)}
                      placeholder="e.g., 300"
                      helperText="Height in pixels"
                    />
                  </Box>
                  <Button
                    variant="outlined"
                    onClick={handleCropImage}
                    startIcon={<Crop />}
                    sx={{ mb: 2 }}
                  >
                    Apply Crop
                  </Button>
                </>
              )}

              {/* Image Link */}
              <Divider sx={{ my: 3 }} />
              <Typography variant="body2" sx={{ mb: 2, fontWeight: 600, color: '#6B7280' }}>
                Image Link (Optional)
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '3fr 1fr',
                  gap: 2
                }}
              >
                <TextField
                  fullWidth
                  label="Link URL"
                  value={imageLink}
                  onChange={(e) => setImageLink(e.target.value)}
                  placeholder="https://example.com"
                  helperText="Make image clickable by adding a link"
                />
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleAddImageLink}
                  startIcon={<LinkIcon />}
                  sx={{ height: '56px' }}
                >
                  Add Link
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResizeDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleResizeImage}>
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

