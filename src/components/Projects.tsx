import { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    MenuItem,
    Grid,
    CircularProgress,
    Tabs,
    Tab,
    Button,
    InputAdornment
  } from '@mui/material';
  import SearchIcon from '@mui/icons-material/Search';
  import Layout from './Layout';
  import { fetchProjectData } from '../utils/fetchData';
  import { ProjectData } from '../types';
  import DataDebugger from './DataDebugger';
  import { isHighPriorityDeveloper } from '../utils/topDevelopers';
  
  export default function Projects() {
    const [data, setData] = useState<{ etim_data: ProjectData[], iig_data: ProjectData[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filterState, setFilterState] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [activeTab, setActiveTab] = useState(0);
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
  
    const currentData = activeTab === 0 ? data.etim_data : data.iig_data;
    
    const states = [...new Set(currentData.map(project => project.State))];
    const statuses = [...new Set(currentData.map(project => 
      project.Status || project['Project Status'] || 'Unknown'))];
  
    const filteredData = currentData.filter(project => {
      const matchesState = !filterState || project.State === filterState;
      const matchesStatus = !filterStatus || (project.Status || project['Project Status']) === filterStatus;
      
      const developerField = activeTab === 0 ? 'Developersorted ascending' : 'Developer';
      const developer = project[developerField] || '';
      
      const matchesHighPriority = !showHighPriority || isHighPriorityDeveloper(developer);
      
      const matchesSearch = !searchQuery || 
        (project.Project || project['Project Title'] || '')
          .toLowerCase().includes(searchQuery.toLowerCase()) ||
        (developer.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesState && matchesStatus && matchesSearch && matchesHighPriority;
    });
  
    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
  
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
      setActiveTab(newValue);
      setPage(0);
      setFilterState('');
      setFilterStatus('');
      setSearchQuery('');
    };
  
    const hasDeveloperField = currentData.every(project => !!project.Developer);
  
    const renderEtimTableHeader = () => (
      <TableRow>
        <TableCell>Project Name</TableCell>
        <TableCell>Developer</TableCell>
        <TableCell>State</TableCell>
        <TableCell>Investment (USD M)</TableCell>
        <TableCell>Project Status</TableCell>
        <TableCell>Source</TableCell>
      </TableRow>
    );
  
    const renderEtimTableRow = (project: ProjectData) => (
      <TableRow>
        <TableCell>{project['Project Name'] || ''}</TableCell>
        <TableCell>{project['Developersorted ascending'] || ''}</TableCell>
        <TableCell>{project['State'] || ''}</TableCell>
        <TableCell>{project['Investment (USD Million)'] || ''}</TableCell>
        <TableCell>{project['Project Status'] || ''}</TableCell>
        <TableCell>{project['source'] || ''}</TableCell>
      </TableRow>
    );
  
    const renderIigTableHeader = () => (
      <TableRow>
        <TableCell>Project Title</TableCell>
        <TableCell>Sector</TableCell>
        <TableCell>State</TableCell>
        <TableCell>Total Project Cost (USD mn)</TableCell>
        <TableCell>Project Status</TableCell>
      </TableRow>
    );
  
    const renderIigTableRow = (project: ProjectData) => (
      <TableRow>
        <TableCell>{project['Title'] || ''}</TableCell>
        <TableCell>{project['Sector'] || ''}</TableCell>
        <TableCell>{project['State'] || ''}</TableCell>
        <TableCell>{project['Total Project Cost (USD mn)'] || ''}</TableCell>
        <TableCell>{project['Project Status'] || ''}</TableCell>
      </TableRow>
    );
  
    const renderTableRows = () => {
      return filteredData
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((project, index) => {
          if (activeTab === 0) {
            return renderEtimTableRow(project);
          } else {
            return renderIigTableRow(project);
          }
        });
    };
  
    const getSearchPlaceholder = () => {
      return activeTab === 0 
        ? "Search by project name, developer, or state..." 
        : "Search by project title, sector, state, or status...";
    };
  
    return (
      <Layout>
        <Box mb={4}>
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
  
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder={getSearchPlaceholder()}
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
            </Grid>
            
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                label="State"
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
              >
                <MenuItem value="">All States</MenuItem>
                {states.map(state => (
                  <MenuItem key={state} value={state}>{state}</MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                label="Status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="">All Statuses</MenuItem>
                {statuses.map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} md={2} sx={{ display: 'flex', alignItems: 'center' }}>
              <Button 
                variant="contained" 
                fullWidth
                onClick={() => setShowHighPriority(!showHighPriority)}
                sx={{ 
                  backgroundColor: showHighPriority ? '#8884d8' : 'rgba(255,255,255,0.1)',
                  '&:hover': { backgroundColor: showHighPriority ? '#7673b8' : 'rgba(255,255,255,0.2)' },
                  height: '56px'
                }}
              >
                {showHighPriority ? 'High Priority ✓' : 'High Priority'}
              </Button>
            </Grid>
          </Grid>
  
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                {activeTab === 0 ? renderEtimTableHeader() : renderIigTableHeader()}
              </TableHead>
              <TableBody>
                {renderTableRows()}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Box>
        <DataDebugger data={data} />
      </Layout>
    );
  } 