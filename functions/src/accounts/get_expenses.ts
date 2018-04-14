import admin = require('firebase-admin');

const cors = require('cors')({origin: true});

module.exports = function (req, res) {
    cors(req, res, async () => {

        if (!req.query.accountIDs || !req.query.from || !req.query.to)
            return res.status(400).send({error: 'Fejl i anmodningen.'});

        const db = admin.firestore();
        const accountIDs = String(req.query.accountIDs).split(",");
        const fromParts = String(req.query.from).split("-");
        const toParts = String(req.query.to).split("-");

        const from = Date.parse(fromParts[1]+ "-" + fromParts[0] + "-" + fromParts[2]);
        const to = Date.parse(toParts[1]+ "-" + toParts[0] + "-" + toParts[2]);

        const getExpensesPromises = [];
        const sortedExpenses = [];

        const expenses = [];
        accountIDs.forEach(accountID => {
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
            const creationDateParts = String(expense.createdAt).split("-");
            const creationDate = Date.parse(creationDateParts[1]+ "-" + creationDateParts[0] + "-" + creationDateParts[2]);
            if (creationDate >= from && creationDate <= to) {
                sortedExpenses.push({
                    amount: expense.amount,
                    categoryTypeID: expense.categoryTypeID
                });
            }
        });
        res.status(200).send(sortedExpenses);
    });
};
