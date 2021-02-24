const functions = require("firebase-functions");
const express = require('express');
const app = express();
const requestPromise = require('request-promise');

/*

// get serviceAccountKey
const serviceAccount = require('../secrets/serviceAccountKey.json');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp({credential: admin.credential.cert(serviceAccount)});
const db = admin.firestore();

*/

// `npm run watch`実行前に以下をターミナルで実行すると、環境変数として指定される
// export GOOGLE_APPLICATION_CREDENTIALS="../secrets/serviceAccountKey.json"

// The Firebase Admin SDK to access Firestore. without Service Account
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();


app.get('/addHoge', (req, res) => {
  const original = 'Hoge';
  const writeResult = admin.firestore().collection('messages').add({original: original});
  res.json({result: `Message with ID: ${writeResult.id} added.`});
});

// メッセージを追加
app.post('/addMessage', async (req, res) => {
  const addedMessage = req.body.message;
  console.log(addedMessage);
  const writeResult = await db.collection('messages').add({message: addedMessage});
  res.json({result: `Message with ID: ${writeResult.id} added.`});
});

// "message"コレクションにあるすべての値を表示
app.get('/getAll', async (req, res) => {
  const snapshot = await db.collection('messages').get();
  const documents = snapshot.docs.map(s => s.data());
  console.log(documents);
  res.send(documents);
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

// const api = functions.https.onRequest(app);
// module.exports = { api };

const hello = (req, res) => {
  res.send('Hello Express!!');
};

const api = (req, res) => {
  res.send('This is API called...');
};


// Slack App ガイドの写経ここから

const sample = (req, res) => {
  res.send('Hello Salck Guide Mockup :p');
};

const axios = require('axios');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/*
const commands = async (req, res) => {
  res.status(200).end(); //タイムアウトを回避。まずレスポンス。
  const body = req.body;
  console.log(body);
  // await sleep(5000) 5秒まつ
  axios.post(body.response_url, {
    text: `<@W018927DL72> ${body.user_name} wanna TakkesyEats:v:`,
    response_type: 'in_channel'
  });
};
*/

const commands = async (req, res) => {
  const body = req.body;
  const [subCommand, ...args] = body.text.split(' '); //分割代入。あとでググる
  res.status(200).end();
  switch (subCommand) {
    case 'hello':
      axios.post(body.response_url, {
        text: `<@W018927DL72> ${body.user_name} wanna TakkesyEats:v:`,
        response_type: 'in_channel'
      });
      break;
    case 'yamabico':
      await sleep(5000);
      axios.post(body.response_url, {
        text: `with delay | TakessyEatsの注文を検知しました:salute:`,
        response_type: 'in_channel'
      });
      break;
    default:
      axios.post(body.response_url, {
        test: `${subCommand}はコマンドとして定義されてないズラ`
      });
      break;
  }
}

const actions = (req, res) => {
  const payload = JSON.parse(req.body.payload);
  const action_id = payload.actions[0].action_id;
  switch (action_id) {
    case 'complete':
      const messageBlocks = payload.message.blocks;
      const now = new Date();
      const responsePayload = {
        blocks: messageBlocks.map(block => {
          return block.block_id !== 'task_actions'
          ? block
          : {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `${now.getMonth()+1}/${now.getDate()}に完了しましたw`
              }
            ]
          }
        }),
        replace_original: true
      }
      axios.post(payload.response_url, responsePayload);
      break;

    case 'delete':
      axios.post(payload.response_url, {
        delete_original: true
      });
      break;
  }
  res.status(200).end();
};


exports.function = functions.https.onRequest((req, res) => {
  const paths = {
    '/sample': sample,
    '/commands': commands,
    '/actions': actions,
    '/api': api,
    '/hello': hello,
    '/': () => res.send(Object.keys(paths))
  };
  for (const [path, route] of Object.entries(paths)) {
    if (req.path.startsWith(path)) {
      return route(req, res);
    }
  }
  res.send('No path found');
});
