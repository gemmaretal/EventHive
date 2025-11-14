import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Link from 'next/link'

export default function Home() {
  return (
    <Box>
      <Typography variant="h1" component="h1" gutterBottom>
        Event Group Buy
      </Typography>
      <Typography variant="body1" paragraph>
        Welcome to EventHive, your platform for organizing and participating in
        group buying events.
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          href="/events"
        >
          Browse Events
        </Button>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          href="/nearby"
        >
          Nearby Event
        </Button>
        <Button
          variant="outlined"
          color="primary"
          component={Link}
          href="/auth/login"
        >
          Login
        </Button>
      </Stack>
    </Box>
  )
}
