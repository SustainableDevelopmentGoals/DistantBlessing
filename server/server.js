const express = require('express')
const WebSocket = require('ws');
const cors = require("cors")
const app = express()
app.use(cors())
app.use(express.json());

const port = 5000
var current_dropoffs = []
var current_clients = []

const wss = new WebSocket.Server({port: 5001});
wss.on('connection', function connection(ws) {
  current_clients.push(ws)
  for(dropoff in current_dropoffs) {
  	ws.send(JSON.stringify(current_dropoffs[dropoff]))
  }
});



app.post('/', function (req, res) {
	var value = req.body
	console.log(value)
  	current_dropoffs.push(value)
  	current_clients.forEach(function(client){
  		client.send(JSON.stringify(value))
  	})
  	res.send(true)
})

app.get('/',function(req,res) {
	res.send(JSON.stringify(current_dropoffs))
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

