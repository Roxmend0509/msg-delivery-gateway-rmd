const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { addMessage, getStats, getMessageById } = require('../queue');

const router = express.Router();

// POST /messages — recibe mensajes de Plataforma A
router.post('/', (req, res) => {
  const { id, content, recipient } = req.body;

  if (!content || !recipient) {
    return res.status(400).json({ 
      error: 'content y recipient son requeridos' 
    });
  }

  const messageId = id || uuidv4();

  const result = addMessage({
    id: messageId,
    content,
    recipient
  });

  if (result.duplicate) {
    return res.status(200).json({ 
      message: 'Mensaje duplicado, ignorado',
      id: messageId,
      duplicate: true
    });
  }

  return res.status(202).json({ 
    message: 'Mensaje recibido y en cola',
    id: messageId,
    duplicate: false
  });
});

// GET /messages/stats — estado general de la cola
router.get('/stats', (req, res) => {
  return res.json(getStats());
});

// GET /messages/:id — estado de un mensaje especifico
router.get('/:id', (req, res) => {
  const msg = getMessageById(req.params.id);
  if (!msg) {
    return res.status(404).json({ error: 'Mensaje no encontrado' });
  }
  return res.json(msg);
});

module.exports = router;