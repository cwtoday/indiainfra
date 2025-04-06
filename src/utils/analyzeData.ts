import * as fs from 'fs';
import * as path from 'path';

function analyzeCSVFiles() {
    // Read ETIM data
    const etimPath = path.join(process.cwd(), 'public', 'data', 'etim_data.csv');
    const etimContent = fs.readFileSync(etimPath, 'utf-8');
    const etimLines = etimContent.split('\n').slice(0, 5);
    
    console.log("ETIM CSV Structure:");
    console.log("Headers:", etimLines[0]);
    console.log("Sample Data:", etimLines.slice(1).join('\n'));

    // Read IIG data
    const iigPath = path.join(process.cwd(), 'public', 'data', 'iig_data.csv');
    const iigContent = fs.readFileSync(iigPath, 'utf-8');
    const iigLines = iigContent.split('\n').slice(0, 5);
    
    console.log("\nIIG CSV Structure:");
    console.log("Headers:", iigLines[0]);
    console.log("Sample Data:", iigLines.slice(1).join('\n'));

    return {
        etim: {
            headers: etimLines[0].split(','),
            sampleData: etimLines.slice(1)
        },
        iig: {
            headers: iigLines[0].split(','),
            sampleData: iigLines.slice(1)
        }
    };
}

function countGreenkoProjects() {
    const etimPath = path.join(process.cwd(), 'public', 'data', 'etim_data.csv');
    const etimContent = fs.readFileSync(etimPath, 'utf-8');
    const etimLines = etimContent.split('\n');
    
    // Count lines where Developersorted ascending contains "Greenko"
    const greenkoCount = etimLines.filter(line => 
        line.includes('Greenko Energies Private Limited') || 
        line.includes('Greenko Group')
    ).length;
    
    console.log("Number of Greenko projects:", greenkoCount);
    
    // Print those lines for verification
    console.log("Greenko projects:");
    etimLines.forEach((line, index) => {
        if (line.includes('Greenko')) {
            console.log(`Line ${index + 1}:`, line);
        }
    });
}

// Run the analysis
const csvStructure = analyzeCSVFiles();
console.log("Analysis Results:", csvStructure); 