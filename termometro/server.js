const express = require('express');
const mysql = require('mysql2');
const app = express();
const PORT = 4000;

// Base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // pon la tuya si tienes
  database: 'sensores'
});

// Sirve HTML estático
app.use(express.static('public'));

// Endpoint REST: temperatura actual por nodo
app.get('/temperatura/:nodo', (req, res) => {
  const nodo = req.params.nodo;

  const query = `
    SELECT temperatura, humedad, timestamp
    FROM lecturas
    WHERE id_nodo = ?
    ORDER BY timestamp DESC
    LIMIT 5
  `;

  db.query(query, [nodo], (err, results) => {
    if (err) return res.status(500).send('Error en la BD');
    if (results.length === 0) return res.status(404).send('Nodo no encontrado');

    const sum = results.reduce((acc, row) => acc + parseFloat(row.temperatura), 0);
    const media = parseFloat((sum / results.length).toFixed(2));

    res.json({
      media,
      ultimas: results
    });
  });
});

// Metaservicio
app.get('/descripcion', (req, res) => {
  res.json({
    servicio: "Termómetro REST",
    version: "1.0",
    endpoints: ["/temperatura/:nodo", "/descripcion"],
    descripcion: "Devuelve la última temperatura por nodo desde la base de datos"
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servicio de termómetro corriendo en http://localhost:${PORT}`);
});
