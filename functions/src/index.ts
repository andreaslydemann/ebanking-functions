const admin = require('firebase-admin');
const functions = require('firebase-functions');
const serviceAccount = require('./config/service_account');

const getAccounts = require('./accounts/getAccounts');
const getExpenses = require('./accounts/getExpenses');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

// ----------ACCOUNT RELATED FUNCTIONS----------
exports.getAccounts = functions.https.onRequest(getAccounts);
exports.getExpenses = functions.https.onRequest(getExpenses);