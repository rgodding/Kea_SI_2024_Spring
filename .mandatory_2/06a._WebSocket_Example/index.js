import express from 'express';

const app = express();
app.use(express.static('public'));

import http from 'http';
import { Server } from 'socket.io';
const server = http.createServer(app);
export const io = new Server(server);
import socketIo from './socketIo.js';
socketIo(io);

const PORT = process.env.PORT ?? 8080;

app.get('/', (
    req, res) => {
    res.sendFile('index.html', { root: './public' });
});



server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});