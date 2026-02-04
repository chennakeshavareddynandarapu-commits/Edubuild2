/**
 * Google Sheets API Service
 * 
 * This service handles all communication between the frontend and your Google Sheet.
 * All project data is now fetched and stored live in the cloud.
 */

// REPLACE THIS with your Google Apps Script Web App URL
// 🚀 LIVE Google Apps Script URL
export const GOOGLE_SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbyZToEtc0PJL8FSmKP73FRrOSIShR7olqaDlzGvOypImD_3TWg4RScyHMWc0IQvmoO5/exec";

/**
 * Fetch all projects live from Google Sheets.
 */
export const fetchProjects = async () => {
    try {
        if (!GOOGLE_SHEET_WEBAPP_URL || GOOGLE_SHEET_WEBAPP_URL === "YOUR_GOOGLE_APPS_SCRIPT_URL") {
            console.error("Google Sheet Web App URL not configured.");
            return [];
        }

        const response = await fetch(GOOGLE_SHEET_WEBAPP_URL);
        const data = await response.json();

        if (!Array.isArray(data)) {
            console.error("Data received from Google Sheets is not an array:", data);
            return [];
        }

        // Map Spreadsheet headers to Application state structure
        return data.map(project => ({
            id: project.ID || project.id || project.Id,
            title: project.Title || project.title,
            subject: project.Subject || project.subject,
            budget: project.Budget || project.budget,
            classLevel: project.Level || project.level || project.classLevel,
            difficulty: project.Difficulty || project.difficulty,
            rating: project.Rating || project.rating,
            type: project.Type || project.type,
            image: project['Image URL'] || project['ImageURL'] || project.ImageUrl || project.image || project.Image,
            concept: project.Concept || project.concept || project.Description || project.description,
            materials: typeof (project.Materials || project.materials) === 'string' ? (project.Materials || project.materials).split(',').map(m => m.trim()) : [],
            instructions: {
                en: typeof (project['Instructions (EN)'] || project['instructions_en']) === 'string' ? (project['Instructions (EN)'] || project['instructions_en']).split('\n') : [],
                ta: typeof (project['Instructions (TA)'] || project['instructions_ta']) === 'string' ? (project['Instructions (TA)'] || project['instructions_ta']).split('\n') : []
            }
        }));
    } catch (error) {
        console.error("Error fetching projects from Google Sheets:", error);
        return [];
    }
};

/**
 * Submit a new experiment to the Google Sheet.
 */
export const submitProject = async (projectData) => {
    try {
        if (!GOOGLE_SHEET_WEBAPP_URL || GOOGLE_SHEET_WEBAPP_URL === "YOUR_GOOGLE_APPS_SCRIPT_URL") {
            throw new Error("Google Sheet Web App URL not configured.");
        }

        const response = await fetch(GOOGLE_SHEET_WEBAPP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectData)
        });
        return true;
    } catch (error) {
        console.error("Error submitting to Google Sheets:", error);
        return false;
    }
};
