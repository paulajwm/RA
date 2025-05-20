import requests
import time
import random

# Configuración
URL = 'http://10.100.0.102:3003/record'  # Cambiá localhost si es remoto
ID_NODO = 'nodo1'

def generar_dato():
    return {
        'id_nodo': ID_NODO,
        'temperatura': round(random.uniform(20.0, 30.0), 2),
        'humedad': round(random.uniform(40.0, 60.0), 2),
        'co2': round(random.uniform(350.0, 600.0), 2),
        'volatiles': round(random.uniform(5.0, 20.0), 2)
    }

try:
    while True:
        datos = generar_dato()
        try:
            response = requests.post(URL, json=datos)
            print(f"Enviado: {datos} → Estado HTTP {response.status_code}")
        except Exception as e:
            print(f"Error al enviar datos: {e}")
        
        time.sleep(30)

except KeyboardInterrupt:
    print("\n Generador detenido por el usuario")
