'use client';

import { AppBar, Box, Container, CssBaseline, ThemeProvider, Toolbar, Typography } from '@mui/material';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import { theme } from '../theme';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'Project Analytics Dashboard',
  description: 'Analytics dashboard for ETIM and IIG projects',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.className}>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppBar position="static" sx={{ backgroundColor: '#1a2235' }}>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                India Infrastructure Projects
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>
                  Dashboard
                </Link>
                <Link href="/projects" style={{ color: 'white', textDecoration: 'none' }}>
                  Projects
                </Link>
                <Link href="/developers" style={{ color: 'white', textDecoration: 'none' }}>
                  Developers
                </Link>
                <Link href="/compare" style={{ color: 'white', textDecoration: 'none' }}>
                  Compare
                </Link>
              </Box>
            </Toolbar>
          </AppBar>
          <Container maxWidth="xl" sx={{ mt: 4 }}>
            {children}
          </Container>
        </ThemeProvider>
      </body>
    </html>
  );
}
