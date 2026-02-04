import { fetchProjects as fetchFromSheets } from '../services/googleSheets';

/**
 * ---------------------------------------------------------------------------
 * NOTE: The local 'projects' array below is temporarily BLOCKED/COMMENTED 
 * to ensure all data is displayed exclusively from live Google Sheets.
 * ---------------------------------------------------------------------------
 */

/* 
export const projects = [
    {
        id: 1,
        title: "Hydraulic Lift",
        budget: 150,
        classLevel: "6-8",
        subject: "Physics",
        difficulty: "Medium",
        materials: ["Syringes (2)", "Cardboard", "Plastic Tubing", "Water", "Glue"],
        instructions: {
            en: ["Connect two syringes...", "Fill system...", "Push syringe...", "Mount..."],
            hi: ["प्लास्टिक टयूबिंग...", "पानी के साथ...", "दूसरे को बढ़ाने...", "एक लिफ्ट..."],
            tel: ["రెండు సిరంజిలను...", "నీటితో నింపండి.", "ఒక సిరంజిని...", "దీన్ని అట్ట..."]
        },
        concept: "Pascal's Principle: Pressure applied to a fluid is transmitted equally in all directions.",
        learningOutcomes: ["Fluid Dynamics", "Force Transmission", "Engineering Design"],
        kitPrice: 1200,
        diyPrice: 150,
        rating: 4.5,
        type: "DIY"
    },
    // ... other static projects hidden
];
*/

// Export an empty array for static references to ensure no hardcoded data is shown
export const projects = [];

/**
 * Strictly fetches projects from Google Sheets.
 * Returns an empty array if the cloud fetch fails, ensuring no local data "leaks" into the frontend.
 */
export const fetchProjects = async () => {
    try {
        const cloudProjects = await fetchFromSheets();
        if (cloudProjects && cloudProjects.length > 0) {
            console.log("✅ Successfully loaded projects from Google Sheets");
            return cloudProjects;
        }
        console.warn("⚠️ No projects found in Google Sheets.");
        return [];
    } catch (error) {
        console.error("❌ Error fetching live projects:", error);
        return [];
    }
};
