import admin = require('firebase-admin');

const cors = require('cors')({origin: true});
const dateHelper = require('../helpers/date_helper');

module.exports = function (req, res) {
    cors(req, res, async () => {

        if (!req.query.accountIDs || !req.query.from || !req.query.to)
            return res.status(400).send({error: 'Fejl i anmodningen.'});

        const db = admin.firestore();
        const acoountIDs = JSON.parse(req.query.accountIDs);
        const from = String(
            dateHelper.toDateString(new Date(req.query.from)));
        const to = String(
            dateHelper.toDateString(new Date(req.query.to)));
        const getExpensesPromises = [];
        const sortedExpenses = [];

        const expenses = [];
        acoountIDs.forEach(accountID => {
            const getExpensesPromise = db.collection("expenses")
                .where("accountID", "==", accountID)
                .get()
                .then((accountExpenses) => {
                    accountExpenses.forEach((expense) => {
                        expenses.push({
                            amount: expense.data().amount,
                            categoryTypeID: expense.data().categoryTypeID,
                            createdAt: expense.data().createdAt
                        })
                    })
                });
            getExpensesPromises.push(getExpensesPromise);
        });

        await Promise.all(getExpensesPromises);
        expenses.forEach((expense) => {
            if (expense.createdAt >= from && expense.createdAt <= to) {
                sortedExpenses.push({
                    amount: expense.amount,
                    categoryTypeID: expense.categoryTypeID
                });
            }
        });
        res.status(200).send(sortedExpenses);
    });
};
