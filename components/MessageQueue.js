import {fork} from 'child_process';

class MessageQueue {
  constructor() {
    this.topics = new Map();
  }

  createTopic(name) {
    if (!name) {
      console.log('Empty topic name');
    } else if (typeof name !== 'string') {
      console.log('Error: Topic name should be a string');
    } else if (this.topics[name]) {
      console.log('Topic name already exists');
    }
    // Fork a new child for every topic
    const newTopic = fork('components/queue.js', [name, 'arguments']);
    this.topics.set(name, newTopic);
    
    if (newTopic) {
      return name;
    } else {
      return 'Error: Topic not created';
    }
  }

  destroyAllTopics() {
    // kills all child processes
    this.topics.forEach((childProcess, topicName) => {
      childProcess.kill();
    })

    const msg = 'All topics now destroyed.'
    console.log(msg);
    return msg
  }

  sendMessage(topic, message) {
    if (!topic) {
      console.log('Error: Topic name invalid')
    } else if (!message) {
      console.log('Error: Message is empty')
    }

    // send message to respective child for topic
    this.topics[topic].send(message);
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

export default MessageQueue;
