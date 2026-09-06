const admin = require("firebase-admin");

let db = null;

<<<<<<< HEAD
try {

    if (
        process.env.GOOGLE_APPLICATION_CREDENTIALS ||
        process.env.FIREBASE_PROJECT_ID
    ) {

        if (!admin.apps.length) {
            admin.initializeApp();
        }

        db = admin.firestore();

        console.log("Firebase Firestore initialized");

    } else {

        console.log(
            "Firebase credentials not configured."
        );

        console.log(
            "Using local JSON database."
        );
    }

} catch (error) {

    console.log(
        "Firebase initialization failed."
    );

    console.log(
        "Using local JSON database."
    );
}

module.exports = {
    admin,
    db
};
=======
const configured =
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY;

if (configured && !admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    })
  });
}

if (admin.apps.length) {
  db = admin.firestore();
}

module.exports = { admin, db };
>>>>>>> e236aa37c353724fa19dffdf3f7b9b17cecac8f5
