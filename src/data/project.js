import { fetchProjects as fetchFromSheets } from '../services/googleSheets';

/**
 * 🚀 LIVE DATA CONNECTOR
 * This file acts as the bridge between your live Google Sheet and the Frontend.
 * It is automatically connected to the Dashboard and Library pages.
 */

/**
 * Static projects array is kept empty to ensure ONLY live data is displayed.
 * To see data, ensure your Google Sheet has active rows.
 */
export const projects = [];

/**
 * liveGoogleSheetsSync
 * This function is called by the frontend to get the latest data from the cloud.
 * It ensures that every time you refresh the page, you get the latest sheet updates.
 */
export const fetchProjects = async () => {
    try {
        console.log("🔄 Syncing with live Google Sheets project data...");
        const cloudProjects = await fetchFromSheets();

        if (cloudProjects && cloudProjects.length > 0) {
            console.log(`✅ Sync Complete: ${cloudProjects.length} projects loaded live.`);
            return cloudProjects;
        }

        console.warn("⚠️ Sync Alert: Google Sheet returned no projects.");
        return [];
    } catch (error) {
        console.error("❌ Sync Error: Failed to connect to Google Sheets.", error);
        return [];
    }
};

/**
 * autoRefresh
 * This ensures that if you keep the website open, it stays in sync.
 * (Components calling fetchProjects already handle this on mount/refresh)
 */
