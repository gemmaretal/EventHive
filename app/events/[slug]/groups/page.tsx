'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { useGroups } from '@/context/GroupContext'
import { mockUsers } from '@/mocks/users'
import GroupCard from '@/components/GroupCard'
import CreateGroupDialog from '@/components/CreateGroupDialog'

export default function EventGroupsPage() {
  const params = useParams()
  const slug = params.slug as string
  const { getGroupsByEvent, createGroup, requestJoin } = useGroups()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState(mockUsers[0]?.id || '')

  const groups = getGroupsByEvent(slug)

  const handleCreateGroup = (data: {
    title: string
    organizerName: string
    maxMembers: number
  }) => {
    createGroup({
      eventSlug: slug,
      ...data,
    })
  }

  const handleJoinGroup = (groupId: string) => {
    if (selectedUserId) {
      requestJoin(groupId, selectedUserId)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Groups for this Event
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Join or create a group to coordinate with other attendees
        </Typography>
      </Box>

      <Box sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setDialogOpen(true)}
        >
          Create Group
        </Button>
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

      {groups.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No groups yet for this event
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Be the first to create one!
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {groups.map(group => (
            <Grid item xs={12} sm={6} md={4} key={group.id}>
              <GroupCard
                group={group}
                onJoinClick={() => handleJoinGroup(group.id)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <CreateGroupDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreateGroup}
        eventSlug={slug}
      />
    </Container>
  )
}
