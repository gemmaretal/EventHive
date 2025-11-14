'use client'

import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'

interface CreateGroupDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: {
    title: string
    organizerName: string
    maxMembers: number
  }) => void
  eventSlug: string
}

export default function CreateGroupDialog({
  open,
  onClose,
  onSubmit,
}: CreateGroupDialogProps) {
  const [title, setTitle] = useState('')
  const [organizerName, setOrganizerName] = useState('')
  const [maxMembers, setMaxMembers] = useState(10)

  const handleSubmit = () => {
    if (title.trim() && organizerName.trim() && maxMembers > 0) {
      onSubmit({
        title: title.trim(),
        organizerName: organizerName.trim(),
        maxMembers,
      })
      setTitle('')
      setOrganizerName('')
      setMaxMembers(10)
      onClose()
    }
  }

  const handleClose = () => {
    setTitle('')
    setOrganizerName('')
    setMaxMembers(10)
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Group</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Group Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Organizer Name"
            value={organizerName}
            onChange={e => setOrganizerName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Max Members"
            type="number"
            value={maxMembers}
            onChange={e => setMaxMembers(parseInt(e.target.value) || 1)}
            fullWidth
            required
            inputProps={{ min: 1 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!title.trim() || !organizerName.trim() || maxMembers < 1}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}
