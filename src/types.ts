export interface ProjectData {
  developer: string | number;
  State: string;
  ProjectName: string;
  Developer: string;
  Capacity: number;
  'Investment (USD Million)'?: number | string;
  'Total Project Cost (USD mn)'?: number | string;
  'Developersorted ascending'?: string;
  source?: string;
  Sector?: string;
  // Add any other fields your data might have
  [key: string]: string | number | undefined; // Add index signature if needed
} 