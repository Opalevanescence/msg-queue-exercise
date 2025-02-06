console.log(`Topic Created: ${process.argv[2]}`);
const messageQueue = [];

process.on('message', (msg) => {
  messageQueue.push(msg);
})