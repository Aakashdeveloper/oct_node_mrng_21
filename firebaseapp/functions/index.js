const functions = require("firebase-functions");
const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');

admin.initializeApp(functions.config().firebase);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const db = admin.firestore();


exports.addMessage = functions.https.onRequest(async (req, res) => {

    const citiesRef = db.collection('citijune');
    await citiesRef.doc('LA').set({
        name: 'Los Angeles', state: 'CA', country: 'USA',
        capital: false, population: 3900000
      });
      await citiesRef.doc('DC').set({
        name: 'Washington, D.C.', state: null, country: 'USA',
        capital: true, population: 680000
      });
      await citiesRef.doc('TOK').set({
        name: 'Tokyo', state: null, country: 'Japan',
        capital: true, population: 9000000
      });
      await citiesRef.doc('BJ').set({
        name: 'Beijing', state: null, country: 'China',
        capital: true, population: 21500000
      });
      res.send('Data Added')
  });


  exports.getMessage = functions.https.onRequest(async (req, res) => {
    const citiesRef = db.collection('citijune');
    const snapshot = await citiesRef.get();
    var out = []
    snapshot.forEach(doc => {
        out.push(doc.data())
    });
    res.send(out);
  });