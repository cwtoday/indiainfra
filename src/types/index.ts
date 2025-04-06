export interface ProjectData {
  Project?: string;
  'Project Title'?: string;
  Developer: string;
  State: string;
  source?: string;
  Sector?: string;
  'Investment (USD Million)'?: number | string;
  'Total Project Cost (USD mn)'?: number | string;
  Status?: string;
  'Project Status'?: string;
  [key: string]: any; // Allow string indexing
}

export interface DeveloperStats {
  projectCount: number;
  states: Set<string>;
  totalValue: number;
  projects: ProjectData[];
}

export interface StateStats {
  count: number;
  totalValue: number;
  projects: ProjectData[];
} 