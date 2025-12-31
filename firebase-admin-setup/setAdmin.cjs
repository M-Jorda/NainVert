const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Replace with YOUR Firebase Auth UID (find it in Firebase Console → Authentication)
const uid = 'hHPXCkDNy0PQ5g67Mtp1mHcfoTb2';

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log('Admin claim set successfully');
    process.exit(0);
  })
  .catch(console.error);
