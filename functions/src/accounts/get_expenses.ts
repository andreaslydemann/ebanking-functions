import admin = require('firebase-admin');

const cors = require('cors')({origin: true});
const dateHelper = require('../helpers/date_helper');

module.exports = function (req, res) {
    cors(req, res, async () => {
        const token = req.get('Authorization').split('Bearer ')[1];
        try {
            await admin.auth().verifyIdToken(token);
        } catch (err) {
            res.status(401).send({error: "Brugeren kunne ikke verificeres."});
        }

        if (!req.query.accountIDs || !req.query.from || !req.query.to)
            return res.status(400).send({error: 'Fejl i anmodningen.'});

        const db = admin.firestore();
        const accountIDs = req.query.accountIDs;
        console.log(accountIDs);
        const from = String(
            dateHelper.toDateString(new Date(req.query.from)));
        console.log("from " + from);
        const to = String(
            dateHelper.toDateString(new Date(req.query.to)));
        console.log("to " + to);

        const getExpensesPromises = [];
        const sortedExpenses = [];

        const expenses = [];
        accountIDs.forEach((accountID) => {
            const getExpensesPromise = db.collection("expenses")
                .where("accountID", "==", accountID)
                .get()
                .then((accountExpenses) => {
                    accountExpenses.forEach((expense) => {
                        expenses.push({
                            amount: expense.data().amount,
                            categoryTypeID: expense.data().categoryTypeID
                        })
                    })
                });
            getExpensesPromises.push(getExpensesPromise);
        });

        console.log("Hej 1");

        await Promise.all(getExpensesPromises);
        expenses.forEach((expense) => {
            if (expense.createdAT >= from && expense.createdAT <= to) {
                sortedExpenses.push({
                    amount: expense.amount,
                    categoryTypeID: expense.categoryTypeID
                });
            }
        });
        res.status(200).send(sortedExpenses);
    });
};
