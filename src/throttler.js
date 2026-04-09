
const { getNextMessages, markAsSent, markAsFailed } = require('./queue');

const PLATFORM_C_URL = process.env.PLATFORM_C_URL || 'http://localhost:4000/receive';
const RATE_LIMIT = 100;

let isRunning = false;

async function sendMessage(message) {
  try {
    const response = await fetch(PLATFORM_C_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });

    if (response.status === 429) {
      markAsFailed(message.id);
      return false;
    }

    if (!response.ok) {
      markAsFailed(message.id);
      return false;
    }

    markAsSent(message.id);
    return true;

  } catch (error) {
    markAsFailed(message.id);
    return false;
  }
}

function startThrottler() {
  if (isRunning) return;
  isRunning = true;

  console.log('Throttler iniciado - enviando max 100 msgs/segundo');

  setInterval(async () => {
    const messages = getNextMessages(RATE_LIMIT);
    if (messages.length === 0) return;
    console.log(`Enviando ${messages.length} mensajes...`);
    await Promise.all(messages.map(msg => sendMessage(msg)));
  }, 1000);
}

module.exports = { startThrottler };