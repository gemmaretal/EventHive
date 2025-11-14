'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Slider,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Drawer,
  IconButton,
  Stack,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { mockEvents } from '@/mocks/events'
import { getRecommendations } from '@/lib/useRecommendations'
import { resolveLocation } from '@/lib/geolocationMock'
import { RequestingPref, RankedCandidate } from '@/lib/recommendation'

const DISTANCE_OPTIONS = [1, 5, 20, 50]

export default function NearbyPage() {
  const [selectedEventSlug, setSelectedEventSlug] = useState<string>('')
  const [genderPref, setGenderPref] = useState<'male' | 'female' | 'any'>('any')
  const [ageRange, setAgeRange] = useState<number[]>([18, 65])
  const [distance, setDistance] = useState<number>(20)
  const [cityInput, setCityInput] = useState<string>('san francisco')
  const [recommendations, setRecommendations] = useState<RankedCandidate[]>([])
  const [invitedUsers, setInvitedUsers] = useState<Set<string>>(new Set())
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('nearbyInvites')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setInvitedUsers(new Set(parsed))
      } catch (e) {
        console.error('Failed to parse stored invites', e)
      }
    }
  }, [])

  const updateRecommendations = useCallback(() => {
    if (!selectedEventSlug) return

    const location = resolveLocation({ city: cityInput })
    const requestingPref: RequestingPref = {
      genderPref,
      ageMin: ageRange[0],
      ageMax: ageRange[1],
      maxDistanceKm: distance,
      location: {
        lat: location.lat,
        lon: location.lon,
      },
    }

    const results = getRecommendations(requestingPref, selectedEventSlug, 20)
    setRecommendations(results)
  }, [selectedEventSlug, genderPref, ageRange, distance, cityInput])

  useEffect(() => {
    if (selectedEventSlug) {
      updateRecommendations()
    }
  }, [selectedEventSlug, updateRecommendations])

  const handleInvite = (userId: string) => {
    const newInvited = new Set(invitedUsers)
    newInvited.add(userId)
    setInvitedUsers(newInvited)
    localStorage.setItem('nearbyInvites', JSON.stringify([...newInvited]))
  }

  const handleRemoveInvite = (userId: string) => {
    const newInvited = new Set(invitedUsers)
    newInvited.delete(userId)
    setInvitedUsers(newInvited)
    localStorage.setItem('nearbyInvites', JSON.stringify([...newInvited]))
  }

  const currentYear = new Date().getFullYear()

  const invitedUsersList = recommendations.filter(user =>
    invitedUsers.has(user.id)
  )

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Nearby Discovery
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Find people nearby who share your interests for events
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Filters
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Event</InputLabel>
                    <Select
                      value={selectedEventSlug}
                      label="Event"
                      onChange={e => setSelectedEventSlug(e.target.value)}
                    >
                      {mockEvents.map(event => (
                        <MenuItem key={event.slug} value={event.slug}>
                          {event.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Gender Preference</InputLabel>
                    <Select
                      value={genderPref}
                      label="Gender Preference"
                      onChange={e =>
                        setGenderPref(
                          e.target.value as 'male' | 'female' | 'any'
                        )
                      }
                    >
                      <MenuItem value="any">Any</MenuItem>
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    value={cityInput}
                    onChange={e => setCityInput(e.target.value)}
                    helperText="e.g., San Francisco, Oakland, San Jose, Palo Alto, Sacramento"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Max Distance (km)</InputLabel>
                    <Select
                      value={distance}
                      label="Max Distance (km)"
                      onChange={e => setDistance(e.target.value as number)}
                    >
                      {DISTANCE_OPTIONS.map(dist => (
                        <MenuItem key={dist} value={dist}>
                          {dist} km
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Typography gutterBottom>
                    Age Range: {ageRange[0]} - {ageRange[1]}
                  </Typography>
                  <Slider
                    value={ageRange}
                    onChange={(_, newValue) =>
                      setAgeRange(newValue as number[])
                    }
                    valueLabelDisplay="auto"
                    min={18}
                    max={80}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {!selectedEventSlug && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                Select an event to see recommendations
              </Typography>
            </Box>
          )}

          {selectedEventSlug && recommendations.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No users found matching your criteria
              </Typography>
            </Box>
          )}

          <Grid container spacing={2}>
            {recommendations.map(user => {
              const age = currentYear - user.birthYear
              const isInvited = invitedUsers.has(user.id)
              const sharedInterestsCount = user.interests.filter(interest =>
                interest.includes(selectedEventSlug)
              ).length

              return (
                <Grid item xs={12} sm={6} key={user.id}>
                  <Card>
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          mb: 1,
                        }}
                      >
                        <Typography variant="h6">{user.name}</Typography>
                        {isInvited && (
                          <Chip label="Invited" color="success" size="small" />
                        )}
                      </Box>

                      <Typography variant="body2" color="text.secondary">
                        Age: {age} • {Math.round(user.distanceKm)} km away
                      </Typography>

                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" gutterBottom>
                          Score: {user.score.toFixed(2)}
                        </Typography>
                        {sharedInterestsCount > 0 && (
                          <Typography variant="body2" color="primary">
                            {sharedInterestsCount} shared interest
                            {sharedInterestsCount > 1 ? 's' : ''}
                          </Typography>
                        )}
                      </Box>

                      <Box
                        sx={{
                          mt: 1,
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 0.5,
                        }}
                      >
                        {user.interests.slice(0, 3).map((interest, idx) => (
                          <Chip
                            key={idx}
                            label={interest}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </CardContent>

                    <CardActions>
                      {!isInvited ? (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleInvite(user.id)}
                        >
                          Invite
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handleRemoveInvite(user.id)}
                        >
                          Remove
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6">
                  Invited ({invitedUsers.size})
                </Typography>
              </Box>

              {invitedUsersList.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No users invited yet
                </Typography>
              ) : (
                <Stack spacing={1}>
                  {invitedUsersList.map(user => {
                    const age = currentYear - user.birthYear
                    return (
                      <Box
                        key={user.id}
                        sx={{
                          p: 1,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {user.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Age: {age}
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveInvite(user.id)}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )
                  })}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 300, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Invited Users
          </Typography>
          {invitedUsersList.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No users invited yet
            </Typography>
          ) : (
            <Stack spacing={1}>
              {invitedUsersList.map(user => {
                const age = currentYear - user.birthYear
                return (
                  <Box
                    key={user.id}
                    sx={{
                      p: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2">{user.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Age: {age}
                    </Typography>
                    <Button
                      size="small"
                      fullWidth
                      onClick={() => handleRemoveInvite(user.id)}
                      sx={{ mt: 1 }}
                    >
                      Remove
                    </Button>
                  </Box>
                )
              })}
            </Stack>
          )}
        </Box>
      </Drawer>
    </Container>
  )
}
