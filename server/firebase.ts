import admin from "firebase-admin";
const projectId = "cheap-car-insurance-49eab";
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: projectId,
  });
}
export const db = admin.firestore();
export const storage = admin.storage();
