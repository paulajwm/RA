import json
import mysql.connector
import paho.mqtt.client as mqtt

# Conexión a la base de datos
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",  # añade tu contraseña si tienes
    database="sensores"
)
cursor = db.cursor()

# Función cuando llega un mensaje MQTT
def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())
        print("Mensaje recibido:", payload)

        query = """
            INSERT INTO lecturas (id_nodo, temperatura, humedad, co2, volatiles, timestamp)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        values = (
            payload['id_nodo'],
            float(payload['temperatura']),
            float(payload['humedad']),
            float(payload['co2']),
            float(payload['volatiles']),
            int(payload['timestamp'])
        )

        cursor.execute(query, values)
        db.commit()
        print("Dato guardado en la base de datos.")
    except Exception as e:
        print("Error procesando mensaje:", e)

# Configurar cliente MQTT
client = mqtt.Client()
client.on_message = on_message

client.connect("localhost", 1883, 60)
client.subscribe("datos/recibidos")

print("Escuchando mensajes MQTT en 'datos/recibidos'...")
client.loop_forever()
