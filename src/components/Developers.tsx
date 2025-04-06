import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  TextField, 
  InputAdornment,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Layout from './Layout';
import { fetchProjectData } from '../utils/fetchData';
import { ProjectData } from '../types';
import DataDebugger from './DataDebugger';
import { HIGH_PRIORITY_DEVELOPERS, isHighPriorityDeveloper, getDisplayName } from '../utils/topDevelopers';

export default function Developers() {
  const [data, setData] = useState<{ etim_data: ProjectData[], iig_data: ProjectData[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showHighPriority, setShowHighPriority] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const projectData = await fetchProjectData();
      setData(projectData);
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading || !data) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  // Analyze developers with proper field names
  const developers = analyzeDevelopers([...data.etim_data, ...data.iig_data]);
  
  // Filter developers based on search and priority
  const filteredDevelopers = Object.entries(developers)
    .filter(([name]) => name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(([name]) => !showHighPriority || isHighPriorityDeveloper(name))
    .sort((a, b) => b[1].totalValue - a[1].totalValue);

  return (
    <Layout>
      <Box sx={{ mt: 2, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Developer Analysis</Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              placeholder="Search developers..."
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
            />
            <Button 
              variant="contained" 
              color={showHighPriority ? "primary" : "inherit"}
              onClick={() => setShowHighPriority(!showHighPriority)}
              sx={{ 
                backgroundColor: showHighPriority ? '#8884d8' : 'rgba(255,255,255,0.1)',
                '&:hover': { backgroundColor: showHighPriority ? '#7673b8' : 'rgba(255,255,255,0.2)' }
              }}
            >
              High Priority Developers
            </Button>
          </Box>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                backgroundColor: '#1a2235',
                borderRadius: 2
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>Developer Search Results</Typography>

              {filteredDevelopers.slice(0, 8).map(([name, stats]) => (
                <Box key={name} sx={{ mb: 3, pb: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: isHighPriorityDeveloper(name) ? '#8884d8' : 'inherit' }}>
                    {getDisplayName(name)}
                    {isHighPriorityDeveloper(name) && 
                      <Chip 
                        label="HIGH PRIORITY" 
                        size="small" 
                        sx={{ 
                          ml: 1,
                          backgroundColor: 'rgba(136, 132, 216, 0.2)',
                          color: '#8884d8',
                          fontWeight: 'bold',
                          fontSize: '0.6rem'
                        }} 
                      />
                    }
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Portfolio Value: <strong>${stats.totalValue.toLocaleString()}</strong> Million
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Projects: <strong>{stats.projectCount}</strong> | 
                    States: <strong>{Array.from(stats.states).slice(0, 3).join(', ')}</strong>
                    {stats.states.size > 3 && '...'}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {Array.from(stats.sectors).slice(0, 3).map(sector => (
                      <Chip 
                        key={sector} 
                        label={sector} 
                        size="small" 
                        sx={{ 
                          backgroundColor: 
                            sector.toLowerCase().includes('hydrogen') ? 'rgba(54, 162, 235, 0.2)' : 
                            sector.toLowerCase().includes('solar') ? 'rgba(255, 193, 7, 0.2)' :
                            sector.toLowerCase().includes('wind') ? 'rgba(76, 175, 80, 0.2)' :
                            sector.toLowerCase().includes('storage') ? 'rgba(156, 39, 176, 0.2)' :
                            'rgba(255, 99, 132, 0.2)',
                          borderRadius: 1
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              ))}
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="h5" gutterBottom>Top Developers for Engagement</Typography>
            
            <Grid container spacing={2}>
              {/* Show top 4 high priority developers */}
              {HIGH_PRIORITY_DEVELOPERS.slice(0, 4).map((developer, index) => (
                <Grid item xs={12} md={6} key={developer}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 3, 
                      backgroundColor: '#1a2235',
                      borderRadius: 2,
                      height: '100%'
                    }}
                  >
                    <Typography variant="h6" color="primary" gutterBottom>
                      {getDisplayName(developer)}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {index === 0 && 'Largest integrated green energy portfolio with solar and wind focus'}
                      {index === 1 && 'Major player in renewable energy with substantial wind capacity'}
                      {index === 2 && 'Government-backed entity with diverse energy portfolio'}
                      {index === 3 && 'Leading storage and hydrogen developer'}
                    </Typography>
                    <Typography variant="body2">
                      {index === 0 && 'Strategic focus on green hydrogen development'}
                      {index === 1 && 'Rapid expansion with international financing'}
                      {index === 2 && 'Strong focus on utility-scale solar development'}
                      {index === 3 && 'Pumped storage projects across multiple states'}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>Developer Opportunity Analysis</Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 3, 
                    backgroundColor: '#1a2235',
                    borderRadius: 2
                  }}
                >
                  <Typography variant="h6" color="primary" gutterBottom>Strategic Partnership Opportunities</Typography>
                  <Typography variant="body2" paragraph>
                    Top developers collectively represent over 70% of the total investment in renewable energy projects,
                    with a combined portfolio value exceeding $150 billion. The majority are focused on utility-scale 
                    solar and wind, but newer projects increasingly include storage and green hydrogen components.
                  </Typography>
                  
                  <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>Market Entry Recommendations</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ pl: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>Primary Targets</Typography>
                        <ul>
                          <li>
                            <Typography variant="body2">
                              <strong>ACME, Greenko, JSW</strong> - Leading hydrogen developers
                            </Typography>
                          </li>
                          <li>
                            <Typography variant="body2">
                              <strong>Adani Green, ReNew</strong> - Scale players with international financing
                            </Typography>
                          </li>
                          <li>
                            <Typography variant="body2">
                              <strong>NTPC, Tata Power</strong> - Government-linked entities with stable finances
                            </Typography>
                          </li>
                        </ul>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ pl: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>Geographic Focus</Typography>
                        <ul>
                          <li>
                            <Typography variant="body2">
                              <strong>Gujarat, Rajasthan</strong> - Solar and wind development hubs
                            </Typography>
                          </li>
                          <li>
                            <Typography variant="body2">
                              <strong>Karnataka, Tamil Nadu</strong> - Storage and hybrid project centers
                            </Typography>
                          </li>
                          <li>
                            <Typography variant="body2">
                              <strong>Maharashtra</strong> - Industrial decarbonization focus
                            </Typography>
                          </li>
                        </ul>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <DataDebugger data={data} />
    </Layout>
  );
}

function analyzeDevelopers(projects: ProjectData[]) {
  // Get proper developer field from each project
  const developerProjects = projects.map(project => {
    const developer = project['Developersorted ascending'] || project['Developer'] || '';
    return {
      ...project,
      developer
    };
  }).filter(p => p.developer); // Only include projects with developer info

  // Group and analyze by developer
  return developerProjects.reduce((acc, project) => {
    const { developer } = project;
    
    if (!acc[developer]) {
      acc[developer] = {
        projectCount: 0,
        states: new Set<string>(),
        totalValue: 0,
        sectors: new Set<string>(),
        projects: []
      };
    }
    
    acc[developer].projectCount += 1;
    if (project.State) acc[developer].states.add(project.State);
    
    const value = Number(project['Investment (USD Million)']) || 
                 Number(project['Total Project Cost (USD mn)']) || 0;
    acc[developer].totalValue += value;
    
    const sector = project.source || project.Sector || 'Unknown';
    if (sector) acc[developer].sectors.add(sector);
    
    acc[developer].projects.push(project);
    
    return acc;
  }, {} as Record<string, {
    projectCount: number;
    states: Set<string>;
    totalValue: number;
    sectors: Set<string>;
    projects: ProjectData[];
  }>);
} 