
const express = require('express');
const dotenv = require('dotenv');
const messagesRouter = require('./routes/messages');
const { startThrottler } = require('./throttler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rutas
app.use('/messages', messagesRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  startThrottler();
});

module.exports = app;