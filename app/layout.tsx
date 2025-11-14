import type { Metadata } from 'next'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import ThemeRegistry from '@/components/ThemeRegistry'

export const metadata: Metadata = {
  title: 'EventHive - Event Group Buy Platform',
  description: 'Organize and participate in group buying events',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeRegistry>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
              }}
            >
              {/* Header */}
              <Box
                component="header"
                sx={{
                  py: 2,
                  px: 3,
                  backgroundColor: 'primary.main',
                  color: 'white',
                }}
              >
                <Container maxWidth="lg">
                  <Typography variant="h6" component="div">
                    EventHive
                  </Typography>
                </Container>
              </Box>

              {/* Main Content */}
              <Box component="main" sx={{ flex: 1, py: 4 }}>
                <Container maxWidth="lg">{children}</Container>
              </Box>

              {/* Footer */}
              <Box
                component="footer"
                sx={{
                  py: 3,
                  px: 2,
                  mt: 'auto',
                  backgroundColor: 'background.paper',
                  borderTop: 1,
                  borderColor: 'divider',
                }}
              >
                <Container maxWidth="lg">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    © {new Date().getFullYear()} EventHive. All rights
                    reserved.
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    <Link href="/about" color="inherit">
                      About
                    </Link>
                    {' | '}
                    <Link href="/contact" color="inherit">
                      Contact
                    </Link>
                  </Typography>
                </Container>
              </Box>
            </Box>
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
