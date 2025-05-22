import requests
import time

# Dirección del HAProxy o balanceador con el Leaky Bucket
URL = "http://10.100.0.102:5000/record"  # Cambia IP y puerto si es necesario

# Datos que se enviarán en el cuerpo del POST
datos = {
    "mensaje": "Prueba de carga",
    "origen": "script Python"
}

# Número de peticiones a enviar
total_peticiones = 20

for i in range(total_peticiones):
    try:
        response = requests.post(URL, json=datos)
        print(f"[{i+1}] Código de respuesta: {response.status_code}")
        if response.status_code != 200:
            print(f"→ Respuesta del servidor: {response.text}")
    except Exception as e:
        print(f"[{i+1}] Error al enviar: {e}")
    
    time.sleep(0)
