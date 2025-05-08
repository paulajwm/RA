import json
import paho.mqtt.client as mqtt

# Configuración del broker Mosquitto (al que se conecta este script)
MQTT_BROKER = 'localhost'
MQTT_PORT = 1883

# Topics de entrada desde los dos servidores
TOPICS_ENTRADA = ['servidor1/data', 'servidor2/data']

# Topic de salida unificado
TOPIC_SALIDA = 'fusionado/datos'

# Conectar al broker
client = mqtt.Client()

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Conectado a Mosquitto")
        # Suscribirse a los topics de entrada
        for topic in TOPICS_ENTRADA:
            client.subscribe(topic)
            print(f"Suscrito a {topic}")
    else:
        print("Falló la conexión, código:", rc)

def on_message(client, userdata, msg):
    try:
        payload = msg.payload.decode('utf-8')
        data = json.loads(payload)
        print(f"Redirigiendo desde {msg.topic} → {TOPIC_SALIDA}: {data}")
        # Republicar el mensaje al topic común
        client.publish(TOPIC_SALIDA, json.dumps(data))
    except Exception as e:
        print("Error procesando mensaje:", e)

client.on_connect = on_connect
client.on_message = on_message

client.connect(MQTT_BROKER, MQTT_PORT)
client.loop_forever()
