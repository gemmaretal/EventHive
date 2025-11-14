'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { useGroups } from '@/context/GroupContext'
import { mockUsers } from '@/mocks/users'
import GroupChat from '@/components/GroupChat'

export default function GroupDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const groupId = params.id as string
  const { getGroupById, acceptMember, leaveGroup } = useGroups()
  const [selectedUserId, setSelectedUserId] = useState(mockUsers[0]?.id || '')

  const group = getGroupById(groupId)

  if (!group) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" color="error">
          Group not found
        </Typography>
      </Container>
    )
  }

  const selectedUser = mockUsers.find(u => u.id === selectedUserId)

  const handleAcceptMember = (userId: string) => {
    acceptMember(groupId, userId)
  }

  const handleLeaveGroup = () => {
    if (selectedUserId) {
      leaveGroup(groupId, selectedUserId)
    }
  }

  const isMember = group.members.includes(selectedUserId)

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
       <Button component={Link}  href={`/events/${slug}/groups`} variant="text" sx={{ mb: 3 }}>
        ← Back to Groups List
      </Button>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {group.title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Organized by {group.organizerName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Members: {group.members.length} / {group.maxMembers}
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Acting as User</InputLabel>
          <Select
            value={selectedUserId}
            label="Acting as User"
            onChange={e => setSelectedUserId(e.target.value)}
          >
            {mockUsers.map(user => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Members
            </Typography>
            {group.members.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No members yet
              </Typography>
            ) : (
              <List>
                {group.members.map((memberId, index) => {
                  const user = mockUsers.find(u => u.id === memberId)
                  return (
                    <Box key={memberId}>
                      {index > 0 && <Divider />}
                      <ListItem>
                        <ListItemText
                          primary={user?.name || memberId}
                          secondary={`User ID: ${memberId}`}
                        />
                      </ListItem>
                    </Box>
                  )
                })}
              </List>
            )}
            {isMember && (
              <Button
                variant="outlined"
                color="error"
                onClick={handleLeaveGroup}
                sx={{ mt: 2 }}
              >
                Leave Group
              </Button>
            )}
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Pending Requests
            </Typography>
            {group.pendingRequests.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No pending requests
              </Typography>
            ) : (
              <List>
                {group.pendingRequests.map((userId, index) => {
                  const user = mockUsers.find(u => u.id === userId)
                  return (
                    <Box key={userId}>
                      {index > 0 && <Divider />}
                      <ListItem
                        secondaryAction={
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleAcceptMember(userId)}
                            disabled={group.members.length >= group.maxMembers}
                          >
                            Accept
                          </Button>
                        }
                      >
                        <ListItemText
                          primary={user?.name || userId}
                          secondary={`User ID: ${userId}`}
                        />
                      </ListItem>
                    </Box>
                  )
                })}
              </List>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            {isMember && selectedUser ? (
              <GroupChat
                groupId={groupId}
                currentUserId={selectedUserId}
                currentUserName={selectedUser.name}
              />
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  You must be a member to access the chat
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}
