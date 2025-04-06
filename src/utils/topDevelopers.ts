// List of high priority developers based on resource analysis
export const HIGH_PRIORITY_DEVELOPERS = [
  'ACME Cleantech Solutions Private Limited',
  'NTPC Group',
  'Greenko Energies Private Limited',
  'Greenko Energy',
  'Greenko Group',
  'JSW Energy Limited',
  'ReNew Power',
  'Tata Power',
  'Azure Power',
  'Avaada Energy Private Limited',
  'Hero Future Energies',
  'Ayana Renewable Power',
  'SB Energy'
];

// Map of developer names to their short display names
export const DEVELOPER_DISPLAY_NAMES = {
  'ACME Cleantech Solutions Private Limited': 'ACME Cleantech',
  'Greenko Energies Private Limited': 'Greenko Energies',
  'Greenko Energy': 'Greenko Energy',
  'Greenko Group': 'Greenko Group',
  'Avaada Energy Private Limited': 'Avaada Energy',
  'ReNew Power Private Limited': 'ReNew Power',
  'Hero Future Energies Private Limited': 'Hero Future Energies',
  'Ayana Renewable Power Private Limited': 'Ayana Renewable Power',
};

// Function to check if a developer is high priority
export function isHighPriorityDeveloper(developer: string): boolean {
  if (!developer) return false;
  
  const developerLower = developer.toLowerCase();
  
  // Check for Greenko specifically
  if (developerLower.includes('greenko')) {
    return true;
  }
  
  // Check other high priority developers
  return HIGH_PRIORITY_DEVELOPERS.some(highPriorityDev => 
    developerLower.includes(highPriorityDev.toLowerCase()));
}

// Function to get the display name for a developer
export function getDisplayName(developer: string): string {
  if (!developer) return '';
  
  // Special case for Greenko
  if (developer.toLowerCase().includes('greenko')) {
    return 'Greenko';
  }
  
  for (const [fullName, shortName] of Object.entries(DEVELOPER_DISPLAY_NAMES)) {
    if (developer.includes(fullName)) {
      return shortName;
    }
  }
  
  // Basic shortening if no mapping exists
  return developer
    .replace('Private Limited', '')
    .replace('Limited', '')
    .replace('Energy Private', 'Energy')
    .trim();
} 