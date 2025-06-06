import requests
import time
import random

URL = "http://localhost:3003/record"

def generar_datos():
    return {
        "id_nodo": "nodo1",
        "temperatura": round(random.uniform(20.0, 30.0), 2),
        "humedad": round(random.uniform(40.0, 60.0), 2),
        "co2": round(random.uniform(400, 800), 2),
        "volatiles": round(random.uniform(0.1, 1.0), 2)
    }

print("Probando el LB de los Middleware")

total_peticiones = 20

for i in range(total_peticiones):
    datos = generar_datos()
    try:
        response = requests.post(URL, json=datos)
        print(f"Enviado: {datos} > Estado {response.status_code}")
        print("Respuesta del middleware:", response.text)
    except Exception as e:
        print("Error al enviar datos:", e)
    time.sleep(0) 
