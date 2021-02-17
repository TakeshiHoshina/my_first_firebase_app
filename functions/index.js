const functions = require("firebase-functions");
const express = require('express');
const requestPromise = require('request-promise');

const app = express();

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

const helloWorld = (req, res) => {
  res.send('Hello, World');
};

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

// const helloWorld = functions.https.onRequest(app);
module.exports = { helloWorld };
