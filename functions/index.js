const functions = require("firebase-functions");
const express = require('express');

const app = express();

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
