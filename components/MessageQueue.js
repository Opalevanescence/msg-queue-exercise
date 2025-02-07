import {fork} from 'child_process';

class MessageQueue {
  constructor() {
    this.topics = new Map();
  }


  createTopic(name) {
    if (!name) {
      console.log('Empty topic name');
      return 400;
    } else if (typeof name !== 'string') {
      console.log('Error: Topic name should be a string');
      return 400;
    } else if (this.topics.has(name)) {
      console.log('Topic name already exists');
      return 400;
    }
    // Fork a new child for every topic
    const newTopic = fork('components/queue.js', [name, 'arguments']);

    this.topics.set(name, newTopic);
    
    if (newTopic) {
      return 200;
    } else {
      return 500;
    }
  }

  destroyAllTopics() {
    // kills all child processes
    this.topics.forEach((childProcess, topicName) => {
      console.log(`Destroying topic: ${topicName}`);
      childProcess.kill();
    })

    console.log('All topics now destroyed.');
    return 200;
  }

  sendMessage(topic, message) {
    if (!topic) {
      console.log('Error: Topic name invalid')
      return 400;
    } else if (!message) {
      console.log('Error: Message is empty')
      return 400;
    }
    const currTopic = this.topics.get(topic);
    if (!currTopic) {
      console.log('Error: Topic name invalid');
      return 400;
    }

    // send message to respective child for topic
    currTopic.send({message});
    return 200;
  }

  getMessage(topic) {
    return new Promise((resolve) => {
      if (!topic) {
        console.log('Error: Topic name invalid')
        resolve(400);
      }
      const currTopic = this.topics.get(topic);
      if (!currTopic) {
        console.log('Error: Topic name invalid');
        resolve(400);
      }

      // send message to respective child for topic
      let response = 500;
      currTopic.once('message',({request, childTopic, message, error}) => {
        if (error) {
          resolve(400);
        }
        if (request === 'getMessage') {
          console.log(`Recieved: \"${message}\" from Topic ${childTopic}`);
          resolve(200);
        }
      });
      currTopic.send({request: 'getMessage'});
    });
  }

  getSize(topic) {
    return new Promise((resolve) => {
      // no topic or topic doesn't exist
      if (!topic) {
        console.log('Error: Topic name invalid')
        resolve(400);
      } 
      const currTopic = this.topics.get(topic);
      if (!currTopic) {
        console.log('Error: Topic name invalid');
        resolve(400);
      }
  
      // get size of queue for topic name
      currTopic.once('message', ({request, childTopic, message, error}) => {
        if (error) {
          resolve(400);
        }
        if (request === 'getSize') {
          console.log(`Recieved: Topic ${childTopic} has queue length ${message}`);
          resolve(200);
        }
        resolve(500);
      });
  
      currTopic.send({request: 'getSize'});
    });
  }
}

export default MessageQueue;
