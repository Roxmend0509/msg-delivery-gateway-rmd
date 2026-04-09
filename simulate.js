const GATEWAY_URL = 'http://localhost:3000/messages';
const TOTAL_MESSAGES = 100000;
const BATCH_SIZE = 1000;

async function sendMessage(i) {
  try {
    const response = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: `msg-${i}-${Date.now()}`,
        content: `Mensaje de prueba numero ${i}`,
        recipient: `user${i}@test.com`
      })
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function simulate() {
  console.log(`Iniciando simulacion de ${TOTAL_MESSAGES} mensajes...`);
  const startTime = Date.now();
  let sent = 0;
  let failed = 0;

  for (let i = 0; i < TOTAL_MESSAGES; i += BATCH_SIZE) {
    const batch = [];
    for (let j = i; j < Math.min(i + BATCH_SIZE, TOTAL_MESSAGES); j++) {
      batch.push(sendMessage(j));
    }
    const results = await Promise.all(batch);
    sent += results.filter(r => r).length;
    failed += results.filter(r => !r).length;
    console.log(`Progreso: ${Math.min(i + BATCH_SIZE, TOTAL_MESSAGES)}/${TOTAL_MESSAGES}`);
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\nSimulacion completada en ${elapsed} segundos`);
  console.log(`Enviados al gateway: ${sent}`);
  console.log(`Fallidos: ${failed}`);
  console.log(`\nRevisa http://localhost:3000/messages/stats`);
}

simulate();