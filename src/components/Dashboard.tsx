import '../utils/chartSetup';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  CircularProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useState, useEffect, useRef } from 'react';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import Layout from './Layout';
import { fetchProjectData } from '../utils/fetchData';
import { ProjectData } from '../types';
import DataDebugger from './DataDebugger';
import 'chart.js/auto';
import dynamic from 'next/dynamic';

// Import MapContainer dynamically to avoid SSR issues
const MapChart = dynamic(() => import('./MapChart'), { ssr: false });

export default function Dashboard() {
  const [data, setData] = useState<{etim_data: ProjectData[], iig_data: ProjectData[]} | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const chartRef = useRef(null);

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

  const currentData = activeTab === 0 ? data.etim_data : data.iig_data;
  const datasetName = activeTab === 0 ? 'ETIM' : 'IIG';
  const valueField = activeTab === 0 ? 'Investment (USD Million)' : 'Total Project Cost (USD mn)';
  
  const totalProjects = currentData.length;
  
  // Calculate total investment correctly using numeric conversion
  const totalValue = currentData.reduce((sum, project) => {
    const value = parseFloat(String(project[valueField] || '0').replace(/,/g, ''));
    return sum + (isNaN(value) ? 0 : value);
  }, 0);
  
  // Count large projects (>500M USD)
  const largeProjects = currentData.filter(project => {
    const value = parseFloat(String(project[valueField] || '0').replace(/,/g, ''));
    return value > 500;
  }).length;
  
  // Count unique developers (use proper field for ETIM data)
  const developerField = activeTab === 0 ? 'Developersorted ascending' : 'Developer';
  const uniqueDevelopers = new Set(
    currentData
      .filter(p => p[developerField]) // Filter out null/undefined
      .map(p => p[developerField])
  ).size;

  // Chart options with improved styling for better visibility
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: 'white',
          font: {
            size: 16,
            weight: 'bold' as const
          },
          padding: 20,
          boxWidth: 15,
          boxHeight: 15
        }
      },
      tooltip: {
        bodyFont: {
          size: 14
        },
        titleFont: {
          size: 16
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        border: {
          display: false
        },
        ticks: {
          color: 'white',
          font: {
            size: 14,
            weight: 'bold' as const
          }
        }
      },
      y: {
        grid: {
          display: false
        },
        border: {
          display: false
        },
        ticks: {
          color: 'white',
          font: {
            size: 14,
            weight: 'bold' as const
          }
        }
      }
    },
    layout: {
      padding: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20
      }
    }
  };

  // Create a special options object for pie/doughnut charts without axes
  const pieChartOptions = {
    ...chartOptions,
    scales: {
      // Remove scales entirely for pie/doughnut charts
      x: { display: false },
      y: { display: false }
    },
    plugins: {
      ...chartOptions.plugins,
      legend: {
        ...chartOptions.plugins.legend,
        position: 'bottom' as const,
        labels: {
          ...chartOptions.plugins.legend.labels,
          padding: 15,
          usePointStyle: true,
        }
      }
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Layout>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>Dashboard Overview</Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': { fontWeight: 600 },
              '& .Mui-selected': { color: '#8884d8' }
            }}
          >
            <Tab label={`ETIM Projects (${data.etim_data.length})`} />
            <Tab label={`IIG Projects (${data.iig_data.length})`} />
          </Tabs>
        </Box>

        {/* India Map with Project Distribution */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 2, 
            mb: 3, 
            height: '400px', 
            borderRadius: 2,
            overflow: 'hidden' // Prevent content from spilling out
          }}
        >
          <Typography variant="h6" gutterBottom>Project Distribution Map</Typography>
          <Box sx={{ 
            height: 'calc(100% - 40px)', 
            position: 'relative', 
            overflow: 'hidden' 
          }}>
            <MapChart data={currentData} />
          </Box>
        </Paper>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>Total Projects</Typography>
              <Typography variant="h3" fontWeight="bold">{totalProjects}</Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>Total Investment</Typography>
              <Typography variant="h3" fontWeight="bold">${totalValue.toLocaleString()}</Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>Large Projects ({'>'}$500M)</Typography>
              <Typography variant="h3" fontWeight="bold">{largeProjects}</Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>Active Developers</Typography>
              <Typography variant="h3" fontWeight="bold">{uniqueDevelopers}</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3}>
          {/* Project Distribution by State Bar Chart */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '400px', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>Project Distribution by State</Typography>
              <Box sx={{ height: 'calc(100% - 40px)' }}>
                <Bar 
                  data={getStateDistributionData(currentData, datasetName, valueField)}
                  options={chartOptions}
                />
              </Box>
            </Paper>
          </Grid>

          {/* Project Status Doughnut Chart */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '400px', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>Project Status Overview</Typography>
              <Box sx={{ height: 'calc(100% - 40px)', display: 'flex', justifyContent: 'center' }}>
                <Doughnut 
                  data={getStatusDistributionData(currentData)}
                  options={{
                    ...pieChartOptions,
                    cutout: '60%',
                  }}
                />
              </Box>
            </Paper>
          </Grid>
          
          {/* Energy Source/Sector Distribution Pie Chart */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '400px', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                {activeTab === 0 ? 'Energy Source Distribution' : 'Sector Distribution'}
              </Typography>
              <Box sx={{ height: 'calc(100% - 40px)', display: 'flex', justifyContent: 'center' }}>
                <Pie 
                  data={getSectorDistributionData(currentData, activeTab === 0)}
                  options={pieChartOptions}
                />
              </Box>
            </Paper>
          </Grid>
          
          {/* Top Developers Horizontal Bar Chart */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '400px', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>Top Developers</Typography>
              <Box sx={{ height: 'calc(100% - 40px)', width: '100%' }}>
                <Bar 
                  data={getTopDevelopersData(currentData, valueField, developerField)}
                  options={{
                    indexAxis: 'y' as const,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'bottom' as const,
                        labels: {
                          color: 'white',
                          font: {
                            size: 12,
                            weight: 'bold' as const
                          },
                          usePointStyle: true,
                          boxWidth: 10
                        }
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `${context.parsed.x.toLocaleString()} M`;
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        grid: {
                          display: false
                        },
                        border: {
                          display: false
                        },
                        ticks: {
                          color: 'white',
                          font: {
                            size: 12
                          },
                          callback: function(value) {
                            return value.toLocaleString();
                          }
                        },
                        title: {
                          display: true,
                          text: 'Total Value (USD Million)',
                          color: 'white',
                          font: {
                            size: 12
                          }
                        }
                      },
                      y: {
                        grid: {
                          display: false
                        },
                        border: {
                          display: false
                        },
                        ticks: {
                          color: 'white',
                          font: {
                            size: 12
                          }
                        }
                      }
                    },
                    maintainAspectRatio: false,
                    responsive: true
                  }}
                />
              </Box>
            </Paper>
          </Grid>
          
          {/* Key Insights Section */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>Key Insights</Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#8884d8' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      activeTab === 0 
                        ? "Renewable energy development is concentrated in resource-rich states like Gujarat, Karnataka, and Rajasthan"
                        : "Infrastructure development shows strong focus on Maharashtra, Karnataka, and Gujarat"
                    } 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#8884d8' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      activeTab === 0 
                        ? "Storage and green hydrogen are emerging as key investment areas with significant project pipeline"
                        : "Roads and highways dominate the infrastructure sector, followed by airports and urban development"
                    } 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#8884d8' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      activeTab === 0 
                        ? "Majority of projects are still in permitting phase, indicating strong future growth potential"
                        : "Many projects are in construction phase, presenting near-term engagement opportunities"
                    } 
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <DataDebugger data={data} />
    </Layout>
  );
}

function getStateDistributionData(data: ProjectData[], datasetName: string, valueField: string) {
  const stateCount: Record<string, number> = {};
  
  data.forEach(project => {
    const state = project.State;
    if (state) { // Only count if state exists
      stateCount[state] = (stateCount[state] || 0) + 1;
    }
  });
  
  // Sort by count and take top 10
  const topStates = Object.entries(stateCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  return {
    labels: topStates.map(([state]) => state),
    datasets: [
      {
        label: `${datasetName} Projects`,
        data: topStates.map(([_, count]) => count),
        backgroundColor: 'rgba(136, 132, 216, 0.7)',
        borderColor: 'rgba(136, 132, 216, 1)',
        borderWidth: 1
      }
    ]
  };
}

function getStatusDistributionData(data: ProjectData[]) {
  const statusCount: Record<string, number> = {};
  
  data.forEach(project => {
    const status = project['Project Status'] || 'Unknown';
    if (status) {
      statusCount[status] = (statusCount[status] || 0) + 1;
    }
  });

  // Ensure there's at least some data
  if (Object.keys(statusCount).length === 0) {
    statusCount['No Status Data'] = 1;
  }

  return {
    labels: Object.keys(statusCount),
    datasets: [{
      data: Object.values(statusCount),
      backgroundColor: [
        'rgba(136, 132, 216, 0.7)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)'
      ],
      borderWidth: 1
    }]
  };
}

function getSectorDistributionData(data: ProjectData[], isEtim: boolean) {
  const sectorCount: Record<string, number> = {};
  
  data.forEach(project => {
    const sector = isEtim 
      ? (project.source || 'Unknown') 
      : (project.Sector || 'Unknown');
    
    if (sector) {
      sectorCount[sector] = (sectorCount[sector] || 0) + 1;
    }
  });

  // Ensure there's at least some data
  if (Object.keys(sectorCount).length === 0) {
    sectorCount['No Sector Data'] = 1;
  }

  // Sort and limit to top 8 sectors for better visibility
  const topSectors = Object.entries(sectorCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  
  return {
    labels: topSectors.map(([sector]) => sector),
    datasets: [{
      data: topSectors.map(([_, count]) => count),
      backgroundColor: [
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(201, 203, 207, 0.7)',
        'rgba(136, 132, 216, 0.7)'
      ],
      borderWidth: 1
    }]
  };
}

function getTopDevelopersData(data: ProjectData[], valueField: string, developerField: string) {
  const developerValue: Record<string, number> = {};
  
  data.forEach(project => {
    const developer = project[developerField];
    
    // Skip if developer is missing
    if (!developer) return;
    
    // Parse value safely
    const valueStr = String(project[valueField] || '0');
    const value = parseFloat(valueStr.replace(/,/g, ''));
    
    if (!isNaN(value)) {
      developerValue[developer] = (developerValue[developer] || 0) + value;
    }
  });
  
  // If no developers with values found
  if (Object.keys(developerValue).length === 0) {
    return {
      labels: ['No Developer Data'],
      originalLabels: ['No Developer Data'],
      datasets: [{
        label: 'Total Value (USD Million)',
        data: [0],
        backgroundColor: 'rgba(136, 132, 216, 0.7)',
      }]
    };
  }
  
  // Sort by value and take top 7
  const topDevelopers = Object.entries(developerValue)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7);
  
  // Store original labels for the custom legend
  const originalLabels = topDevelopers.map(([dev]) => dev);
  
  // Format values with M suffix for better readability
  const formattedValues = topDevelopers.map(([_, value]) => value);
  
  return {
    labels: originalLabels,
    originalLabels: originalLabels,
    datasets: [
      {
        label: 'Total Value (USD Million)',
        data: formattedValues,
        backgroundColor: 'rgba(136, 132, 216, 0.7)',
        borderColor: 'rgba(136, 132, 216, 1)',
        borderWidth: 1
      }
    ]
  };
} 