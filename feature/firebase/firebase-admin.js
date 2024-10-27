// feature/firebase-admin.js
import admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://bookstore-economy.firebaseio.com" // Thay đổi URL này cho phù hợp với dự án của bạn
  });
}

export default admin;
