import time
import random
import json
import paho.mqtt.publish as publish

# Datos base
topic = "datos/recibidos"
broker = "localhost"

while True:
    payload = {
        "id_nodo": "nodo1",
        "temperatura": round(random.uniform(20.0, 30.0), 2),
        "humedad": round(random.uniform(40.0, 60.0), 2),
        "co2": round(random.uniform(400, 800), 2),
        "volatiles": round(random.uniform(0.1, 1.0), 2),
        "timestamp": int(time.time() * 1000)
    }

    print("Publicando:", payload)

    publish.single(topic, json.dumps(payload), hostname=broker)
    time.sleep(5)  # Espera 5 segundos antes del siguiente envío
