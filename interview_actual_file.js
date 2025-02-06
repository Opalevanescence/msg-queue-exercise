const { fork } = require("child_process");

class MessageQueue {
  constructor() {
    this.topics = [];
    this.messages = {};
  }

  createTopic(name) {
    console.log({"hello": name})
    if (!name) {
      console.log('Empty topic name')
    } else if (typeof name !== 'string') {
      console.log('Error: Topic name should be a string')
    } else if (this.topics.includes(name)) {
      console.log('Topic name already exists')
    }
    // TODO fork a new child for every topic
    // const topic = fork('child.js');
    this.topics.push(name);
    const obj = {}
    obj[name] = []
    this.messages.push(name)

    console.log(`Topic Created: ${name}`)
  }

  destroyAllTopics() {
    // kills all child processes
    this.topics = []
    this.messages = []
  }

  sendMessage(topic, message) {
    if (!topic) {
      console.log('Error: Topic name invalid')
    } else if (!message) {
      console.log('Error: Message is empty')
    }
    // send message to respective child for topic
    // topic.send(message);
    this.messages[topic].push(message);
    // if added succssfully
    console.log(`Message Added: ${message} to Topic ${topic}`);
  }

  getMessage(topic) {
    if (!topic) {
      console.log('Error: Topic name invalid')
    } else if (this.messages[topic] == []) {
      console.log('Error: Queue is empty')
    }

    // send message to respective child for topic
    // process.on('message', (msg) => {
    //   console.log(`Recieved: ${msg} from Topic ${topic}`);
    // });
    const msg = this.messages[topic].shift()
    // if successfully received
    console.log(`Recieved: ${msg} from Topic ${topic}`)
  }

  getSize(topic) {
    // no topic or topic doesn't exist
    if (!topic || !this.topics.includes(topic)) {
      console.log('Error: Topic name invalid')
    } 
    // get size of queue for topic name
    // return queue.length
    return this.messages[topic].length
  }
}

module.exports = MessageQueue;
