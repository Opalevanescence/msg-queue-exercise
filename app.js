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
  // GOOD
  const { name } = req.body
  const result = await myQueue.createTopic(name);

  return res.json({ result });
});

app.post('/destroyTopics', async (req, res) => {
  // GOOD
  const result = await myQueue.destroyAllTopics();

  return res.json({ result });
});

app.listen(port);