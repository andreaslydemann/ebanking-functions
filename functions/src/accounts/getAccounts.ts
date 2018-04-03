import admin = require('firebase-admin');

const cors = require('cors')({origin: true});

module.exports = function (req, res) {
    cors(req, res, () => {
        const db = admin.firestore();
        const userID = String(req.query.userID);

        db.collection("accounts")
            .where("cprNumber", "==", userID)
            .get()
            .then((querySnapshot) => {
                const accountArray = [];

                querySnapshot.forEach((doc) => {
                    accountArray.push({id: doc.id, accountData: doc.data()});
                });
                res.status(200).send(accountArray);
            })
            .catch(() => res.status(422).send({error: 'Kunne ikke hente konti.'}));
    })
};
