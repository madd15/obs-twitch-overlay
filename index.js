const express = require('express')
const WebSocket = require('ws')

const app = express()
const port = 8081

app.use(express.static('static'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message)
    })
    ws.send('something');
})

