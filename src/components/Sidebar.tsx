import { Box, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const router = useRouter();

  const menuItems = [
    { text: 'Dashboard', path: '/' },
    { text: 'Projects', path: '/projects' },
    { text: 'Developers', path: '/developers' },
    { text: 'Compare', path: '/compare' }
  ];

  return (
    <Box
      sx={{
        width: 240,
        flexShrink: 0,
        backgroundColor: '#1a2235',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1200,
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <img src="/logo.png" alt="Logo" style={{ width: 180 }} />
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => router.push(item.path)}
              sx={{
                py: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                },
              }}
            >
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  color: 'white',
                  '& .MuiTypography-root': {
                    fontWeight: 500
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
} 