import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { projects } from '../src/data/projects.js';

// Load service account
const serviceAccount = JSON.parse(
    readFileSync('./edubuild-9cb5d-firebase-adminsdk-fbsvc-dab51aef42.json', 'utf8')
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function sync() {
    console.log("🚀 Starting Cloud Firestore Sync...");
    const collectionRef = db.collection('projects');

    try {
        // Check if projects already exist to avoid duplicates
        const snapshot = await collectionRef.get();
        if (snapshot.size > 0) {
            console.log(`⚠️ Database already has ${snapshot.size} projects. Skipping to prevent duplicates.`);
            console.log("Tip: If you want to force refresh, delete the collection in Firebase Console first.");
            return;
        }

        console.log(`📦 Preparing to upload ${projects.length} experiments...`);

        for (const project of projects) {
            // Use the project ID as the document ID for consistency
            const { id, ...data } = project;
            await collectionRef.doc(id.toString()).set({
                ...data,
                syncedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log(`✅ Uploaded: ${project.title}`);
        }

        console.log("\n✨ Sync Complete! Your cloud database is now live.");
    } catch (error) {
        console.error("❌ Sync Failed!");
        console.error("Error Code:", error.code);
        console.error("Message:", error.message);
        if (error.message.includes("NOT_FOUND")) {
            console.log("\n💡 Potential Cause: The Firestore database has not been 'created' in the Firebase Console yet.");
            console.log("Please go to: https://console.firebase.google.com/project/edubuild-9cb5d/firestore and click 'Create Database'.");
        }
    } finally {
        process.exit();
    }
}

sync();
