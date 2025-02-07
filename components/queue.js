const topic = process.argv[2];
const messageQueue = [];

console.log(`Topic Created: ${topic}`);

process.on('message', ({request, message}) => {
  // {request, childTopic, message, error}
  if (message) {
    // Add message to queue
    messageQueue.push(message);
  
    console.log(`Message Added: ${message} to Topic ${topic}`);
  } else if (request === "getSize") {
    // Send message to parent
    console.log("ARRIVED - request for message");
    if (!messageQueue.length) {
      console.log('Error: Queue is empty');
      process.send({error: 400});
    } else {
      process.send({request, childTopic: topic, message: messageQueue.shift()});
    }
  } else if (request === "getMessage") {
    console.log("ARRIVED - request for length");
    process.send({request, childTopic: topic, message: messageQueue.length})
  }
})