/**
 * Service to interact with Google Sheets as a database.
 */

const GOOGLE_SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbyZToEtc0PJL8FSmKP73FRrOSIShR7olqaDlzGvOypImD_3TWg4RScyHMWc0IQvmoO5/exec";

export const fetchProjectsFromSheet = async () => {
    try {
        if (!GOOGLE_SHEET_WEBAPP_URL || GOOGLE_SHEET_WEBAPP_URL.includes("YOUR_URL")) {
            console.warn("Google Sheet URL not configured properly.");
            return null;
        }
        const response = await fetch(GOOGLE_SHEET_WEBAPP_URL);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching from Google Sheet:", error);
        return null;
    }
};

export const submitProjectToSheet = async (projectData) => {
    try {
        const response = await fetch(GOOGLE_SHEET_WEBAPP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(projectData)
        });
        return true;
    } catch (error) {
        console.error("Error submitting to Google Sheet:", error);
        return false;
    }
};
