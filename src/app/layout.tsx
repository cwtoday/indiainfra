'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/theme';
import CssBaseline from '@mui/material/CssBaseline';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import { Box, useMediaQuery } from '@mui/material';
import Head from 'next/head';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useMediaQuery('(max-width:960px)');

  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      </Head>
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box sx={{ display: 'flex' }}>
            {/* Hide sidebar on mobile */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Sidebar />
            </Box>
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                ml: { xs: 0, md: '240px' }, // Only add margin on desktop
                minHeight: '100vh',
                backgroundColor: '#0a1929',
                pb: { xs: 'calc(56px + env(safe-area-inset-bottom))', md: '24px' } // Add padding for bottom nav on mobile including safe area
              }}
            >
              {children}
            </Box>
          </Box>
          {isMobile && <BottomNav />}
        </ThemeProvider>
      </body>
    </html>
  );
}
