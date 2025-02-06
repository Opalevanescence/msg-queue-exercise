import {fork} from 'child_process';

class MessageQueue {
  constructor() {
    this.topics = new Map();
  }

  // TODO: Refactor. there should only be one "on" listener that handles all cases


  createTopic(name) {
    if (!name) {
      console.log('Empty topic name');
      return 400;
    } else if (typeof name !== 'string') {
      console.log('Error: Topic name should be a string');
      return 400;
    } else if (this.topics[name]) {
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
    if (!topic) {
      console.log('Error: Topic name invalid')
      return 400;
    }
    const currTopic = this.topics.get(topic);
    if (!currTopic) {
      console.log('Error: Topic name invalid');
      return 400;
    }

    // send message to respective child for topic
    currTopic.send({isMsgReq: true});
    currTopic.on('message', ({childTopic, message, error}) => {
      if (error) {
        return 400;
      }
      // if successfully received
      console.log(`Recieved: ${message} from Topic ${childTopic}`);
      return 200;
    });
  }

  getSize(topic) {
    // no topic or topic doesn't exist
    if (!topic) {
      console.log('Error: Topic name invalid')
      return 400;
    } 
    const currTopic = this.topics.get(topic);
    if (!currTopic) {
      console.log('Error: Topic name invalid');
      return 400;
    }

    // get size of queue for topic name
    currTopic.send({isLengthReq: true});
    currTopic.on('message', ({childTopic, length, error}) => {
      if (error) {
        return 400;
      }
      // if successfully received
      console.log(`Recieved: Topic ${childTopic} has queue length ${length}`);
      return 200;
    });
  }
}

export default MessageQueue;
