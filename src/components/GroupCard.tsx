import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Link from 'next/link'
import { type Group } from '@/mocks/groups'

interface GroupCardProps {
  group: Group
  onJoinClick?: () => void
}

export default function GroupCard({ group, onJoinClick }: GroupCardProps) {
  const isFull = group.members.length >= group.maxMembers

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          {group.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          👤 Organizer: {group.organizerName}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          👥 Members: {group.members.length} / {group.maxMembers}
        </Typography>
        {isFull && (
          <Typography variant="body2" color="error" gutterBottom>
            Group is full
          </Typography>
        )}
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Button
            component={Link}
            href={`/groups/${group.id}`}
            variant="outlined"
            size="small"
          >
            View Details
          </Button>
          {onJoinClick && !isFull && (
            <Button
              onClick={onJoinClick}
              variant="contained"
              size="small"
              color="primary"
            >
              Join
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}
