import time
import random
import json
import paho.mqtt.publish as publish

# Configuración
TOPIC = "datos/recibidos"
BROKER = "localhost"  # Cambia si usas IP diferente

def generar_datos():
    return {
        "id_nodo": "nodo1",
        "temperatura": round(random.uniform(20.0, 30.0), 2),
        "humedad": round(random.uniform(40.0, 60.0), 2),
        "co2": round(random.uniform(400, 800), 2),
        "volatiles": round(random.uniform(0.1, 1.0), 2),
        "timestamp": int(time.time() * 1000)
    }

print("Simulador activo: publicando datos cada 60 segundos...")

while True:
    payload = generar_datos()
    print("Enviando:", payload)
    
    publish.single(TOPIC, json.dumps(payload), hostname=BROKER)
    time.sleep(60)  # Espera 60 segundos antes del siguiente envío
