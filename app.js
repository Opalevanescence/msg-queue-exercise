import express from 'express'
import bodyParser from 'body-parser';
import MessageQueue from './components/MessageQueue.js'

const app = express();
const port = 8080;

console.log('Process started');
console.log('Listening on port 8080...');

const myQueue = new MessageQueue();

app.use(bodyParser.json());

app.post('/createTopic', async (req, res) => {
  const { name } = req.body
  const result = await myQueue.createTopic(name);

  return res.json({ result });
});

app.post('/destroyTopics', async (req, res) => {
  const result = await myQueue.destroyAllTopics();

  return res.json({ result });
});

app.post('/sendMessage', async (req, res) => {
  const { topic, message } = req.body
  const result = await myQueue.sendMessage(topic, message);

  return res.json({ result });
});

app.post('/getMessage', async (req, res) => {
  const { topic } = req.body
  const result = await myQueue.getMessage(topic);

  return res.json({ result });
});

app.post('/getSize', async (req, res) => {
  const { topic } = req.body
  const result = await myQueue.getSize(topic);

  return res.json({ result });
});

app.listen(port);