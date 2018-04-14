const admin = require('firebase-admin');
const functions = require('firebase-functions');
const serviceAccount = require('./config/service_account');

const getAccounts = require('./accounts/get_accounts');
const getExpensesBetweenDates = require('./accounts/get_expenses_between_dates');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

// ----------ACCOUNT RELATED FUNCTIONS----------
exports.getAccounts = functions.https.onRequest(getAccounts);
exports.getExpensesBetweenDates = functions.https.onRequest(getExpensesBetweenDates);