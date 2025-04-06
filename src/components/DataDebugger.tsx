import { Box, Typography, Paper, List, ListItem } from '@mui/material';
import { ProjectData } from '@/types';

export default function DataDebugger({ data }: {
  data: { etim_data: ProjectData[], iig_data: ProjectData[] } | null
}) {
  if (!data) return null;

  // Count Greenko projects
  const greenkoProjects = data.etim_data.filter(p => {
    const developer = String(p['Developersorted ascending'] || p.Developer || '');
    return developer.includes('Greenko');
  }).length;

  // Check developer field in IIG
  const iigWithDeveloper = data.iig_data.filter(p => !!p.Developer).length;

  // Total investment
  const etimInvestment = data.etim_data.reduce((sum, p) => {
    const value = parseFloat(String(p['Investment (USD Million)'] || '0').replace(/,/g, ''));
    return sum + (isNaN(value) ? 0 : value);
  }, 0);

  const iigInvestment = data.iig_data.reduce((sum, p) => {
    const value = parseFloat(String(p['Total Project Cost (USD mn)'] || '0').replace(/,/g, ''));
    return sum + (isNaN(value) ? 0 : value);
  }, 0);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mt: 2,
        backgroundColor: '#1a2235',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 2
      }}
    >
      <Typography variant="h5" color="green" sx={{ mt: 1 }}>
        ETIM dataset - Energy Transition Investment Monitor by CII and EY.
        IIG dataset - India Investment Grid by Government of India.
      </Typography>
      {(data.etim_data.length === 0 || data.iig_data.length === 0) && (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          Warning: Missing data. Check CSV files and loading process.
        </Typography>
      )}
    </Paper>
  );
} 