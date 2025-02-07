const topic = process.argv[2];
const messageQueue = [];

console.log(`Topic Created: ${topic}`);

process.on('message', ({request, message}) => {
  const error = false;

  if (message) {
    // Add message to queue
    messageQueue.push(message);
  
    console.log(`Message Added: ${message} to Topic ${topic}`);
  } else if (request === "getMessage") {
    // Send message to parent
    if (!messageQueue.length) {
      console.log('Error: Queue is empty');
      process.send({error: true});
    } else {
      process.send({request, childTopic: topic, message: messageQueue.shift(), error});
    }
  } else if (request === "getSize") {
    process.send({request, childTopic: topic, message: messageQueue.length, error})
  }
})