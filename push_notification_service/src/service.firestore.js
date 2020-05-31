const admin = require('firebase-admin');
const serviceAccount = require('../config/commhawk-cf438-firebase-adminsdk-y5wz7-e7c2b571e0.json'); //configuration file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

module.exports = db;