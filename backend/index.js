const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

let currentNumber = 0;

app.get('/api/next', (req, res) => {
  currentNumber++;
  io.emit('number_called', currentNumber);
  res.json({ number: currentNumber });
});

app.get('/api/reset', (req, res) => {
  currentNumber = 0;
  io.emit('number_reset');
  res.json({ status: 'reset' });
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.emit('number_called', currentNumber);
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

let counter = { P: 0, Q: 0, R: 0 };

app.get('/api/ambil', (req, res) => {
  const prefix = req.query.prefix;
  if (!['P', 'Q', 'R'].includes(prefix)) return res.status(400).json({ error: 'Invalid prefix' });
  counter[prefix]++;
  const nomor = `${prefix}-${counter[prefix]}`;
  res.json({ nomor });
});
