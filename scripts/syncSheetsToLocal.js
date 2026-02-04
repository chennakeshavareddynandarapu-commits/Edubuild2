import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🚀 Your LIVE Google Apps Script URL
const GOOGLE_SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbyZToEtc0PJL8FSmKP73FRrOSIShR7olqaDlzGvOypImD_3TWg4RScyHMWc0IQvmoO5/exec";

async function syncSheetsToLocal() {
    console.log("📥 Fetching latest project details from Google Sheets...");

    try {
        const response = await fetch(GOOGLE_SHEET_WEBAPP_URL);
        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Invalid data format received from Google Sheets.");
        }

        console.log(`✅ Received ${data.length} projects from cloud.`);

        // Format the data back into the JS structure for project.js
        const projectsJson = JSON.stringify(data.map(p => ({
            id: p.ID || p.id || p.Id,
            title: p.Title || p.title,
            subject: p.Subject || p.subject,
            budget: p.Budget || p.budget,
            classLevel: p.Level || p.level || p.classLevel,
            difficulty: p.Difficulty || p.difficulty,
            rating: p.Rating || p.rating,
            type: p.Type || p.type,
            image: p['Image URL'] || p['ImageURL'] || p.ImageUrl || p.image || p.Image,
            concept: p.Concept || p.concept || p.Description || p.description,
            materials: typeof (p.Materials || p.materials) === 'string' ? (p.Materials || p.materials).split(',').map(m => m.trim()) : [],
            instructions: {
                en: typeof (p['Instructions (EN)'] || p['instructions_en']) === 'string' ? (p['Instructions (EN)'] || p['instructions_en']).split('\n') : [],
                ta: typeof (p['Instructions (TA)'] || p['instructions_ta']) === 'string' ? (p['Instructions (TA)'] || p['instructions_ta']).split('\n') : []
            }
        })), null, 4);

        const targetPath = path.join(__dirname, '../src/data/project.js');

        const fileContent = `import { fetchProjects as fetchFromSheets } from '../services/googleSheets';

/**
 * 🔄 AUTO-SYNCED DATA
 * This file was automatically updated from Google Sheets on ${new Date().toLocaleString()}.
 */

export const projects = ${projectsJson};

/**
 * liveGoogleSheetsSync
 * Use this to fetch the absolute latest data from the cloud in real-time.
 */
export const fetchProjects = async () => {
    try {
        const cloudProjects = await fetchFromSheets();
        if (cloudProjects && cloudProjects.length > 0) {
            return cloudProjects;
        }
        return projects; // Fallback to the synced data in this file
    } catch (error) {
        console.warn("Using local synced fallback due to sync error:", error);
        return projects;
    }
};
`;

        fs.writeFileSync(targetPath, fileContent);
        console.log("✨ SUCCESS: src/data/project.js has been updated with the latest Google Sheet data!");
        console.log("You can now see the 'Solar Oven' and other new projects in the app.");

    } catch (error) {
        console.error("❌ Sync failed:", error.message);
    }
}

syncSheetsToLocal();
