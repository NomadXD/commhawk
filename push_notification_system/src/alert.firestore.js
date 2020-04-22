const admin = require('firebase-admin');
const serviceAccount = require('../config/sem5proj-4c149-firebase-adminsdk-km5ja-1d94745744.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

module.exports = db;