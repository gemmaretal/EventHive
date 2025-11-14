'use client'

import { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { chatStub, type ChatMessage } from '@/lib/chatStub'

interface GroupChatProps {
  groupId: string
  currentUserId: string
  currentUserName: string
}

export default function GroupChat({
  groupId,
  currentUserId,
  currentUserName,
}: GroupChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const unsubscribe = chatStub.subscribe(groupId, newMessages => {
      setMessages(newMessages)
    })

    return () => {
      unsubscribe()
    }
  }, [groupId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      chatStub.publish(groupId, {
        groupId,
        userId: currentUserId,
        userName: currentUserName,
        content: inputMessage.trim(),
      })
      setInputMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Group Chat
      </Typography>
      <Paper
        sx={{
          flexGrow: 1,
          p: 2,
          mb: 2,
          maxHeight: 400,
          overflowY: 'auto',
          backgroundColor: '#f5f5f5',
        }}
      >
        {messages.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No messages yet. Start the conversation!
          </Typography>
        ) : (
          messages.map(message => (
            <Box
              key={message.id}
              sx={{
                mb: 2,
                p: 1.5,
                backgroundColor:
                  message.userId === currentUserId ? '#e3f2fd' : '#fff',
                borderRadius: 1,
                border: '1px solid #e0e0e0',
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {message.userName} •{' '}
                {new Date(message.timestamp).toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {message.content}
              </Typography>
            </Box>
          ))
        )}
        <div ref={messagesEndRef} />
      </Paper>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Type a message..."
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          disabled={!inputMessage.trim()}
        >
          Send
        </Button>
      </Box>
    </Box>
  )
}
