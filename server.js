const express = require('express');
const http = require('http');
const url = require('url');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const { Block, Blockchain } = require('./blockchain.js')


// ---
const nodeName = process.env.NODE_NAME || 'br134n';
let server_port = process.env.SERVER_PORT || 8080;

let sockets = [];
let status = {
    CONNECTED: 1
};
let blockchain = new Blockchain;
let transactions = [];

// WEB
const app = express();

let connectToPeer = (peers) => {
    peers.forEach((peer) => {
        let ws = new WebSocket(peer);
        ws.on('open', () => initConnection(ws));
        ws.on('error', () => { console.log('connection failed') });
    })
};

app.use(bodyParser.json());
app.get('/', (req, res) => res.send({ msg: "BlockchainJS | La404" }));
app.get('/blocks', (req, res) => res.send(JSON.stringify(blockchain)));
app.get('/transactions', (req, res) => res.send(JSON.stringify(transactions)));
app.get('/peers', (req, res) => res.send(sockets.map(s => s.nodeName)));
app.post('/addPeer', (req, res) => {
    connectToPeer([req.body.peer]);
    res.send();
});

// SERVERS
const server = http.createServer(app);
const serverP2P = new WebSocket.Server({ server });

// P2P
serverP2P.on('connection', ws => initConnection(ws));

let sendMessage = (ws, message) => {
    message.from = nodeName;
    ws.send(JSON.stringify(message));
}
let broadcast = (message) => sockets.forEach(socket => sendMessage(socket, message));

let initConnection = (ws) => {
    ws.nodeName = nodeName;
    sockets.push(ws);
    messageHandler(ws);
    errorHandler(ws);
    sendMessage(ws,{ status: status.CONNECTED })
};

let messageHandler = (ws) => {
    ws.on('message', (data) => {
        var message = JSON.parse(data);
        console.log('Received message' + JSON.stringify(message));

        switch (message.status) {
            case status.CONNECTED:
                break;
        }
    });
};

let errorHandler = (ws) => {
    let closeConnection = (ws) => { sockets.splice(sockets.indexOf(ws), 1) };
    ws.on('close', () => closeConnection(ws));
    ws.on('error', () => closeConnection(ws));
};

//Init Node
server.listen(server_port);
