import { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, CircularProgress } from '@mui/material';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import Layout from './Layout';
import { fetchProjectData } from '../utils/fetchData';
import { ProjectData } from '../types';
import '../utils/chartSetup';

export default function Compare() {
  const [data, setData] = useState<{ etim_data: ProjectData[], iig_data: ProjectData[] } | null>(null);
  const [loading, setLoading] = useState(true);

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

  // Common chart options for consistent styling
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'white',
          font: {
            size: 14,
            weight: 'bold' as const
          },
          padding: 20,
          usePointStyle: true,
          boxWidth: 10
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
        ticks: {
          color: 'white',
          font: {
            size: 14,
            weight: 'bold' as const
          }
        },
        grid: {
          display: false
        },
        border: {
          display: false
        }
      },
      y: {
        ticks: {
          color: 'white',
          font: {
            size: 14,
            weight: 'bold' as const
          }
        },
        grid: {
          display: false
        },
        border: {
          display: false
        }
      }
    },
    layout: {
      padding: {
        left: 15,
        right: 15,
        top: 15,
        bottom: 15
      }
    }
  };

  // Options for pie/doughnut charts without axes
  const pieChartOptions = {
    ...chartOptions,
    scales: {
      x: { display: false },
      y: { display: false }
    },
  };

  // Prepare data for comparison charts
  const etimStateStats = getStateStatistics(data.etim_data, 'Investment (USD Million)');
  const iigStateStats = getStateStatistics(data.iig_data, 'Total Project Cost (USD mn)');
  
  const etimSectors = getSectorDistribution(data.etim_data);
  const iigSectors = getSectorDistribution(data.iig_data);
  
  const etimStatuses = getStatusDistribution(data.etim_data);
  const iigStatuses = getStatusDistribution(data.iig_data);

  // Get top states for comparison
  const topStates = [...new Set([
    ...Object.entries(etimStateStats).sort((a, b) => b[1].count - a[1].count).slice(0, 10).map(([state]) => state),
    ...Object.entries(iigStateStats).sort((a, b) => b[1].count - a[1].count).slice(0, 10).map(([state]) => state)
  ])].slice(0, 10);

  // Prepare state comparison data
  const stateComparisonData = {
    labels: topStates,
    datasets: [
      {
        label: 'ETIM Projects',
        data: topStates.map(state => etimStateStats[state]?.count || 0),
        backgroundColor: 'rgba(136, 132, 216, 0.7)',
        borderColor: 'rgba(136, 132, 216, 1)',
        borderWidth: 1
      },
      {
        label: 'IIG Projects',
        data: topStates.map(state => iigStateStats[state]?.count || 0),
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };

  // Prepare sector data for pie charts
  const etimSectorData = {
    labels: Object.keys(etimSectors).slice(0, 8),
    datasets: [{
      data: Object.values(etimSectors).slice(0, 8),
      backgroundColor: [
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(201, 203, 207, 0.7)',
        'rgba(136, 132, 216, 0.7)',
      ]
    }]
  };

  const iigSectorData = {
    labels: Object.keys(iigSectors).slice(0, 8),
    datasets: [{
      data: Object.values(iigSectors).slice(0, 8),
      backgroundColor: [
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(201, 203, 207, 0.7)',
        'rgba(136, 132, 216, 0.7)',
      ]
    }]
  };

  // Prepare status comparison data
  const allStatuses = [...new Set([...Object.keys(etimStatuses), ...Object.keys(iigStatuses)])];
  
  const statusComparisonData = {
    labels: allStatuses,
    datasets: [
      {
        label: 'ETIM Projects',
        data: allStatuses.map(status => etimStatuses[status] || 0),
        backgroundColor: 'rgba(136, 132, 216, 0.7)',
        borderColor: 'rgba(136, 132, 216, 1)',
        borderWidth: 1
      },
      {
        label: 'IIG Projects',
        data: allStatuses.map(status => iigStatuses[status] || 0),
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };

  return (
    <Layout>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>Dataset Comparison</Typography>
        <Typography variant="body1" gutterBottom>
          Comparing {data.etim_data.length} ETIM projects with {data.iig_data.length} IIG projects
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, height: '400px', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Top States Comparison</Typography>
            <Box sx={{ height: 'calc(100% - 40px)' }}>
              <Bar data={stateComparisonData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '400px', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>ETIM Sectors</Typography>
            <Box sx={{ height: 'calc(100% - 40px)', display: 'flex', justifyContent: 'center' }}>
              <Pie data={etimSectorData} options={pieChartOptions} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '400px', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>IIG Sectors</Typography>
            <Box sx={{ height: 'calc(100% - 40px)', display: 'flex', justifyContent: 'center' }}>
              <Pie data={iigSectorData} options={pieChartOptions} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, height: '400px', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Project Status Comparison</Typography>
            <Box sx={{ height: 'calc(100% - 40px)' }}>
              <Bar 
                data={statusComparisonData} 
                options={chartOptions}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Key Insights</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Dataset Coverage:</strong> ETIM dataset focuses on energy transition projects 
                  including renewable energy, storage, and hydrogen, while IIG dataset covers broader 
                  infrastructure including roads, ports, and urban development.
                </Typography>
                
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Geographic Distribution:</strong> Both datasets show strong activity in 
                  Karnataka, Maharashtra, and Gujarat, making these states prime targets for market entry.
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Project Size:</strong> IIG generally tracks larger infrastructure projects, 
                  while ETIM includes smaller renewable energy initiatives with higher overall project count.
                </Typography>
                
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Project Status:</strong> Both datasets show a mix of permitting and under 
                  construction projects, with ETIM having more early-stage projects in emerging 
                  sectors like storage and hydrogen.
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}

// Helper functions for data processing
function getStateStatistics(data: ProjectData[], valueField: string) {
  return data.reduce((acc, project) => {
    const state = project.State;
    if (!state) return acc;
    
    if (!acc[state]) {
      acc[state] = { count: 0, totalValue: 0 };
    }
    acc[state].count += 1;
    
    const value = parseFloat(String(project[valueField] || '0').replace(/,/g, ''));
    acc[state].totalValue += !isNaN(value) ? value : 0;
    
    return acc;
  }, {} as Record<string, { count: number; totalValue: number }>);
}

function getSectorDistribution(data: ProjectData[]) {
  const sectorField = 'source' in data[0] ? 'source' : 'Sector';
  
  const sectorCount = data.reduce((acc, project) => {
    const sector = project[sectorField] || 'Unknown';
    acc[sector] = (acc[sector] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Sort by count and return top sectors
  return Object.fromEntries(
    Object.entries(sectorCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
  );
}

function getStatusDistribution(data: ProjectData[]) {
  return data.reduce((acc, project) => {
    const status = project['Project Status'] || 'Unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}