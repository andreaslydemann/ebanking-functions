import admin = require('firebase-admin');

const cors = require('cors')({origin: true});

module.exports = function (req, res) {
    cors(req, res, () => {
        const db = admin.firestore();
        const accountID = String(req.query.accountID);

        db.collection("expenses")
            .where("accountID", "==", accountID)
            .get()
            .then((querySnapshot) => {
                const expenseArray = [];

                querySnapshot.forEach((doc) => {
                    expenseArray.push({
                        categoryTypeID: doc.data().categoryTypeID,
                        amount: doc.data().amount
                    });
                });
                res.status(200).send(expenseArray);
            })
            .catch(() => res.status(422).send({error: 'Kunne ikke hente udgifter.'}));
    })
};
