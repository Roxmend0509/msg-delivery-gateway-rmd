const queue = [];
const sentIds = new Set();

function addMessage(message) {
  if (sentIds.has(message.id)) {
    return { duplicate: true };
  }
  queue.push({
    ...message,
    status: 'pending',
    attempts: 0,
    createdAt: new Date().toISOString()
  });
  return { duplicate: false };
}

function getNextMessages(limit = 100) {
  return queue
    .filter(m => m.status === 'pending' || m.status === 'retry')
    .slice(0, limit);
}

function markAsSent(id) {
  const msg = queue.find(m => m.id === id);
  if (msg) {
    msg.status = 'sent';
    msg.sentAt = new Date().toISOString();
    sentIds.add(id);
  }
}

function markAsFailed(id) {
  const msg = queue.find(m => m.id === id);
  if (msg) {
    msg.attempts += 1;
    msg.status = msg.attempts >= 3 ? 'failed' : 'retry';
  }
}

function getStats() {
  return {
    total: queue.length,
    pending: queue.filter(m => m.status === 'pending').length,
    sent: queue.filter(m => m.status === 'sent').length,
    retry: queue.filter(m => m.status === 'retry').length,
    failed: queue.filter(m => m.status === 'failed').length,
  };
}

function getMessageById(id) {
  return queue.find(m => m.id === id) || null;
}

module.exports = { 
  addMessage, 
  getNextMessages, 
  markAsSent, 
  markAsFailed, 
  getStats, 
  getMessageById 
};