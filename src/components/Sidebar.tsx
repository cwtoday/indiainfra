import { Box, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
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
      <Box sx={{ 
        p: 3, 
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center'
      }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #6c5dd3, #7FBA7A)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.5px'
          }}
        >
          India CapitALL
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '0.75rem',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}
        >
          Infrastructure Capital
        </Typography>
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