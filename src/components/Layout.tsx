import { Box, Container } from '@mui/material';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box component="main">
        {children}
      </Box>
    </Container>
  );
} 