import { ProjectData } from '@/types';

// Helper type for the accumulator
type StateAggregation = {
  count: number;
  totalValue: number;
  projects: ProjectData[];
};

// Helper type for the return value
type StateAggregationMap = Record<string, StateAggregation>;

export function aggregateProjectsByState(
  projects: ProjectData[],
  valueField: keyof ProjectData // This ensures valueField is a valid key of ProjectData
): StateAggregationMap {
  return projects.reduce((acc: StateAggregationMap, project) => {
    const state = project.State;
    if (!state) return acc;

    if (!acc[state]) {
      acc[state] = {
        count: 0,
        totalValue: 0,
        projects: []
      };
    }
    acc[state].count += 1;
    // Safe access using type assertion
    const value = project[valueField];
    acc[state].totalValue += typeof value === 'number' ? value : Number(value) || 0;
    acc[state].projects.push(project);
    return acc;
  }, {} as StateAggregationMap);
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