var express = require('express');
var router = express.Router();
var fs = require('fs');
const mqtt = require('mqtt');

// Conexión al broker MQTT
const mqttClient = mqtt.connect('mqtt://localhost:1883');

mqttClient.on('connect', () => {
    console.log('Conectado al broker MQTT');
});

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Data-Logger' });
});

router.get('/record', function(req, res) {
    saveData(req.query, res);
});

router.post('/record', function(req, res) {
    saveData(req.body, res);
});

function saveData(data, res) {
    if (!data.id_nodo || !data.temperatura || !data.humedad || !data.co2 || !data.volatiles) {
        return res.status(400).send("Error: Faltan parámetros en la solicitud.");
    }

    const now = new Date();
    const logfile_name = __dirname + '/../public/logs/' + data.id_nodo + "-" + 
        now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + '.csv';

    const content = data.id_nodo + ';' + now.getTime() + ";" + 
                    data.temperatura + ";" + data.humedad + ";" + 
                    data.co2 + ";" + data.volatiles + "\r\n";

    // Publicar por MQTT
    try {
        const jsonPayload = {
            id_nodo: data.id_nodo,
            temperatura: data.temperatura,
            humedad: data.humedad,
            co2: data.co2,
            volatiles: data.volatiles,
            timestamp: now.getTime()
        };

        // Protegemos el uso de JSON.stringify
        if (typeof JSON.stringify === "function") {
            mqttClient.publish('datos/recibidos', JSON.stringify(jsonPayload));
        } else {
            console.error("Error: JSON.stringify no está disponible.");
        }

    } catch (error) {
        console.error("Error al publicar en MQTT:", error);
    }

    fs.stat(logfile_name, function(err, stat) {
        if (err && err.code === 'ENOENT') {
            const header = 'id_nodo; timestamp; temperatura; humedad; CO2; volatiles\r\n';
            append2file(logfile_name, header + content, res);
        } else {
            append2file(logfile_name, content, res);
        }
    });
}

function append2file(file2append, content, res) {
    fs.appendFile(file2append, content, function(err) {
        if (err) {
            console.error("Error al guardar en archivo:", err);
            return res.status(500).send("Error al guardar en el archivo.");
        }

        console.log("Guardado en:", file2append);
        res.status(200).send("Datos guardados correctamente en: " + file2append);
    });
}

module.exports = router;
