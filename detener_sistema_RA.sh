#!/bin/bash

echo "=========================="
echo " DETENIENDO SISTEMA RA IoT"
echo "=========================="

# Detener procesos Node.js
echo "→ Matando procesos node..."
pkill -f app.js
pkill -f server.js
pkill -f leaky_bucket_instance1.js
pkill -f leaky_bucket_instance2.js

# Detener procesos Python
echo "→ Matando procesos Python..."
pkill -f mqtt_to_sql.py
pkill -f simulador_http.py
pkill -f prueba_LB_20datos.py

echo "✅ Todos los procesos detenidos."
