import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import CompareIcon from '@mui/icons-material/Compare';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { label: 'Projects', icon: <BusinessIcon />, path: '/projects' },
    { label: 'Developers', icon: <PeopleIcon />, path: '/developers' },
    { label: 'Compare', icon: <CompareIcon />, path: '/compare' }
  ];

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: '#1a2235',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: { xs: 'block', md: 'none' }, // Only show on mobile
        pb: 'env(safe-area-inset-bottom)', // Add padding for iOS safe area
      }}
      elevation={3}
    >
      <BottomNavigation
        value={pathname}
        onChange={(event, newValue) => {
          router.push(newValue);
        }}
        sx={{
          backgroundColor: 'transparent',
          '& .MuiBottomNavigationAction-root': {
            color: 'rgba(255, 255, 255, 0.7)',
            '&.Mui-selected': {
              color: '#8884d8',
            },
          },
        }}
      >
        {menuItems.map((item) => (
          <BottomNavigationAction
            key={item.path}
            label={item.label}
            value={item.path}
            icon={item.icon}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
} 