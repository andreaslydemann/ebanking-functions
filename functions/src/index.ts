const admin = require('firebase-admin');
const functions = require('firebase-functions');
const serviceAccount = require('./config/service_account');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

export const helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});
