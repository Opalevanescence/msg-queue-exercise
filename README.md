# Message Queues Exercise

## Start
```
npm install
node app.js
```

## Example Queries
Use these queries to test out the endpoints. Returns will be status codes. Console logs will have additional information.

```
# Create Topic
curl -X POST http://localhost:8080/createTopic -H "Content-Type: application/json" -d '{"name":"pears"}'

# Send Messages
curl -X POST http://localhost:8080/sendMessage -H "Content-Type: application/json" -d '{"topic":"pears", "message":"Definitely dessert"}'
curl -X POST http://localhost:8080/sendMessage -H "Content-Type: application/json" -d '{"topic":"pears", "message":"Schoolhouse rock dobedobedo"}'
curl -X POST http://localhost:8080/sendMessage -H "Content-Type: application/json" -d '{"topic":"pears", "message":"Eat with butter"}'

# Get Size
curl -X POST http://localhost:8080/getSize -H "Content-Type: application/json" -d '{"topic":"pears"}'

# Get Message
curl -X POST http://localhost:8080/getMessage -H "Content-Type: application/json" -d '{"topic":"pears"}'

# Destroy Topics
curl -X POST http://localhost:8080/destroyTopics -H "Content-Type: application/json"
```

## After closing application
Use `ps aux | grep node` to see if any child processes are accidentally left running after you shut down the application.
