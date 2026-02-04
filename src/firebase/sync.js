import { db } from './config';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { projects } from '../data/projects';

export const syncProjectsToFirestore = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'projects'));
        if (querySnapshot.size > 0) {
            console.log("Firestore already has projects. Skipping sync.");
            return;
        }

        console.log("Syncing projects to Firestore...");
        for (const project of projects) {
            // Remove the local ID to let Firestore generate a unique one, 
            // or keep it if you want consistent IDs.
            const { id, ...data } = project;
            await addDoc(collection(db, 'projects'), data);
        }
        console.log("Sync complete!");
    } catch (error) {
        console.error("Error syncing projects: ", error);
    }
};
