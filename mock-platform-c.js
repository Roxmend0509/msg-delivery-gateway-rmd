const express = require('express');

const app = express();
const PORT = 4000;

app.use(express.json());

let receivedCount = 0;
let requestsThisSecond = 0;
const RATE_LIMIT = 100;

// Reset contador cada segundo
setInterval(() => {
  requestsThisSecond = 0;
}, 1000);

// Endpoint que recibe mensajes
app.post('/receive', (req, res) => {
  requestsThisSecond++;

  if (requestsThisSecond > RATE_LIMIT) {
    console.log(`Rate limit excedido - rechazando mensaje`);
    return res.status(429).json({ 
      error: 'Rate limit exceeded' 
    });
  }

  receivedCount++;
  console.log(`Mensaje recibido #${receivedCount} - ID: ${req.body.id}`);

  return res.status(200).json({ 
    success: true, 
    messageId: req.body.id,
    totalReceived: receivedCount
  });
});

// Stats del mock
app.get('/stats', (req, res) => {
  res.json({ 
    totalReceived: receivedCount,
    requestsThisSecond 
  });
});

app.listen(PORT, () => {
  console.log(`Mock Plataforma C corriendo en puerto ${PORT}`);
});