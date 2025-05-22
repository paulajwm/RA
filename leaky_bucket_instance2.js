const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 5001;
const NOMBRE = process.env.NOMBRE || 'LB2';
const BACKEND = process.env.BACKEND || 'http://10.100.0.102:3001/record'; // Cambiar según el caso

app.use(express.json());

const buckets = {};
const capacity = 50;
const leakRate = 1;
const interval = 1000;

setInterval(() => {
  for (let ip in buckets) {
    buckets[ip] = Math.max(0, buckets[ip] - leakRate);
  }
}, interval);

app.post('/record', async (req, res) => {
  const ip = req.ip.replace('::ffff:', '');

  if (!buckets[ip]) buckets[ip] = 0;

  if (buckets[ip] >= capacity) {
    console.log(`[${NOMBRE}] IP ${ip} bloqueada`);
    return res.status(429).send("Límite de peticiones superado");
  }

  buckets[ip]++;
  console.log(`[${NOMBRE}] Petición de ${ip} aceptada. Bucket: ${buckets[ip]}`);

  try {
    const response = await axios.post(BACKEND, req.body);
    res.status(response.status).send(response.data);
  } catch (err) {
    console.error(`[${NOMBRE}] Error al reenviar:`, err.message);
    res.status(500).send("Error reenviando al servidor backend");
  }
});

app.listen(PORT, () => {
  console.log(`Leaky Bucket ${NOMBRE} escuchando en puerto ${PORT}`);
});
