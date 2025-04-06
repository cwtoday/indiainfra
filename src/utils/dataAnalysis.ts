interface ProjectData {
  Project?: string;
  'Project Title'?: string;
  Developer: string;
  State: string;
  source?: string;
  Sector?: string;
  'Investment (USD Million)'?: number;
  'Total Project Cost (USD mn)'?: number;
  Status: string;
  'Project Status'?: string;
}

export function getStateStatistics(data: ProjectData[], valueField: string) {
  return data.reduce((acc, project) => {
    const state = project.State;
    if (!acc[state]) {
      acc[state] = { count: 0, totalValue: 0, projects: [] };
    }
    acc[state].count += 1;
    acc[state].totalValue += Number(project[valueField]) || 0;
    acc[state].projects.push(project);
    return acc;
  }, {} as Record<string, { count: number; totalValue: number; projects: ProjectData[] }>);
}

export function getDeveloperAnalysis(data: ProjectData[]) {
  return data.reduce((acc, project) => {
    const developer = project.Developer;
    if (!acc[developer]) {
      acc[developer] = {
        projectCount: 0,
        states: new Set(),
        totalValue: 0,
        projects: []
      };
    }
    acc[developer].projectCount += 1;
    acc[developer].states.add(project.State);
    acc[developer].totalValue += Number(project['Investment (USD Million)']) || 
                                Number(project['Total Project Cost (USD mn)']) || 0;
    acc[developer].projects.push(project);
    return acc;
  }, {} as Record<string, {
    projectCount: number;
    states: Set<string>;
    totalValue: number;
    projects: ProjectData[];
  }>);
}

export function getProjectValueRanges(data: ProjectData[], valueField: string) {
  const ranges = {
    'Under 100M': 0,
    '100M-300M': 0,
    '300M-500M': 0,
    'Over 500M': 0
  };

  data.forEach(project => {
    const value = Number(project[valueField]) || 0;
    if (value < 100) ranges['Under 100M']++;
    else if (value < 300) ranges['100M-300M']++;
    else if (value < 500) ranges['300M-500M']++;
    else ranges['Over 500M']++;
  });

  return ranges;
} 