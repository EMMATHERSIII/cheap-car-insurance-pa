import admin from "firebase-admin";

const projectId = "cheap-car-insurance-19e83";

if (!admin.apps.length) {
  // Get credentials from environment variable
  const credentialsJson = process.env.FIREBASE_ADMIN_SDK_KEY;
  
  if (credentialsJson) {
    try {
      const credentials = JSON.parse(credentialsJson);
      admin.initializeApp({
        credential: admin.credential.cert(credentials),
        projectId: projectId,
      });
    } catch (error) {
      console.error("Failed to parse Firebase credentials:", error);
      // Fallback to default credentials
      admin.initializeApp({
        projectId: projectId,
      });
    }
  } else {
    // Use default credentials (for local development or when GOOGLE_APPLICATION_CREDENTIALS is set)
    admin.initializeApp({
      projectId: projectId,
    });
  }
}

export const db = admin.firestore();
export const storage = admin.storage();
