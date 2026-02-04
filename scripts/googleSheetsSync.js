import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Path to your service account key file
const KEY_FILE = path.join(__dirname, '../vm-ddk-business-9ee25e005e0d.json');

// 2. Your Google Sheet ID
const SPREADSHEET_ID = '1DuIt5rzR4Ro2YHO4gCOAeglcrNSYWgPIUnnQIcvgxu8';

// 3. Extract projects array from projects.js
const projectsFilePath = path.join(__dirname, '../src/data/projects.js');
const projectsContent = fs.readFileSync(projectsFilePath, 'utf8');
const projectsMatch = projectsContent.match(/export const projects = (\[[\s\S]*?\]);/);

let projects;
try {
    // Standardizing the JS object to valid JSON for parsing
    // (A bit hacky but works for this specific structure)
    const jsonString = projectsMatch[1]
        .replace(/id:/g, '"id":')
        .replace(/title:/g, '"title":')
        .replace(/image:/g, '"image":')
        .replace(/budget:/g, '"budget":')
        .replace(/classLevel:/g, '"classLevel":')
        .replace(/subject:/g, '"subject":')
        .replace(/difficulty:/g, '"difficulty":')
        .replace(/materials:/g, '"materials":')
        .replace(/instructions:/g, '"instructions":')
        .replace(/en:/g, '"en":')
        .replace(/ta:/g, '"ta":')
        .replace(/concept:/g, '"concept":')
        .replace(/learningOutcomes:/g, '"learningOutcomes":')
        .replace(/rating:/g, '"rating":')
        .replace(/type:/g, '"type":')
        .replace(/'/g, '"') // Replace single quotes with double quotes
        .replace(/,\s*]/g, ']') // Remove trailing commas in arrays
        .replace(/,\s*}/g, '}'); // Remove trailing commas in objects

    projects = JSON.parse(jsonString);
} catch (e) {
    // Fallback to eval if JSON parse fails (risky but okay for internal local tool)
    projects = eval('(' + projectsMatch[1] + ')');
}

async function syncToSheets() {
    console.log("🚀 Starting Precise Column-Wise Sync...");

    const auth = new google.auth.GoogleAuth({
        keyFile: KEY_FILE,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    try {
        // DEFINITIVE COLUMN SCHEMA
        const header = [
            'ID', 'Title', 'Subject', 'Budget', 'Level',
            'Difficulty', 'Rating', 'Type', 'Materials',
            'Image URL', 'Concept', 'Instructions (EN)', 'Instructions (TA)'
        ];

        const rows = projects.map(p => [
            p.id || '',
            p.title || '',
            p.subject || '',
            p.budget || '',
            p.classLevel || '',
            p.difficulty || '',
            p.rating || '',
            p.type || '',
            Array.isArray(p.materials) ? p.materials.join(', ') : (p.materials || ''),
            p.image || '',
            p.concept || '',
            p.instructions?.en ? p.instructions.en.join('\n') : '',
            p.instructions?.ta ? p.instructions.ta.join('\n') : ''
        ]);

        const values = [header, ...rows];

        // Clear the sheet first to ensure clean state
        await sheets.spreadsheets.values.clear({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Sheet1!A:Z',
        });

        // Update with structured column data
        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Sheet1!A1',
            valueInputOption: 'RAW',
            resource: { values },
        });

        console.log("\n✨ COLUMN-WISE SYNC COMPLETE!");
        console.log("-------------------------------------------------");
        console.log("Your data is now perfectly organized in columns.");
        console.log(`Open Sheet: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`);
    } catch (error) {
        console.error("❌ Sync Failed:", error.message);
    }
}

syncToSheets();
