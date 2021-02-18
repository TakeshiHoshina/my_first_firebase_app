const functions = require("firebase-functions");
const express = require('express');
const requestPromise = require('request-promise');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

const app = express();


app.get('/addHoge', (req, res) => {
  const original = 'Hoge';
  const writeResult = admin.firestore().collection('messages').add({original: original});
  res.json({result: `Message with ID: ${writeResult.id} added.`});
});


app.post('/addMessage', async (req, res) => {
  const addedMessage = req.body.message;
  console.log(addedMessage);
  const writeResult = await admin.firestore().collection('messages').add({message: addedMessage});
  res.json({result: `Message with ID: ${writeResult.id} added.`});
});

app.post('/console', (req, res) => {
  const text = req.body.text;
  console.log(text);
  res.redirect('/');
});


const getDataFromApi = async (cityname) => {
  try {
    const apiKey = functions.config().openwheather.key;
    const url = (`https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${functions.config().openwheather.key}`)
    const result = await requestPromise({
      uri: url,
      method: 'GET'
    });
    return result;
  } catch (error) {
    return ('Error caught : ' + error.message);
  }
};

app.get('/', (req, res) => {
  res.render('hello.ejs');
});

app.get('/helloWorld', (req, res) => {
  res.send('Hello, World');
});

app.get('/weather/:cityname', (req, res) => {
  getDataFromApi(req.params.cityname).then((response) => res.send(response));
});

app.get('/apikey', (req, res) => {
  const apiKey = functions.config().openwheather.key;
  res.send('API Key is ' + apiKey);
});

app.get('/hello', (req, res) => {
  res.send('Hello Express!!');
});

app.get('/user/:userId', (req, res) => {
  const users = [
    { id: 1, name: "りゅうおう" },
    { id: 2, name: "ハーゴン" },
    { id: 3, name: "バラモス" },
    { id: 4, name: "ゾーマ" },
    { id: 5, name: "ピサロ" }
  ];

  const targetUser = users.find(
    (user) => user.id === Number(req.params.userId)
  );
  res.send(targetUser);
});

const api = functions.https.onRequest(app);
module.exports = { api };
