const admin = require('firebase-admin');
const serviceAccount = require('../config/sem5proj-4c149-firebase-adminsdk-km5ja-595f0b755e.json'); //configuration file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

module.exports = db;