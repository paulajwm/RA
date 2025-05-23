#!/bin/bash

echo "=========================="
echo " INICIANDO SISTEMA COMPLETO"
echo "=========================="

# 1. Lanzar middleware Node.js
echo "→ Iniciando app.js (middleware)..."
cd ~/RA/SSR-master-server-main
nohup node app.js > ../logs_app.log 2>&1 &
cd ~/RA

# 2. Leaky Bucket LB1
echo "→ Iniciando Leaky Bucket LB1 (puerto 5000)..."
PORT=5000 NOMBRE=LB1 BACKEND=http://10.100.0.102:3000/record nohup node leaky_bucket_instance1.js > logs_LB1.log 2>&1 &

# 3. Leaky Bucket LB2
echo "→ Iniciando Leaky Bucket LB2 (puerto 5001)..."
PORT=5001 NOMBRE=LB2 BACKEND=http://10.100.0.102:3001/record nohup node leaky_bucket_instance2.js > logs_LB2.log 2>&1 &

# 4. Script de base de datos
echo "→ Ejecutando mqtt_to_sql.py..."
nohup python3 mqtt_to_sql.py > logs_sql.log 2>&1 &

# 5. Servicio REST termómetro
echo "→ Ejecutando server.js (servicio REST)..."
cd ~/RA/termometro
nohup node server.js > ../logs_termometro.log 2>&1 &
cd ~/RA

# 6. Prueba del Leaky Bucket (en primer plano, visible para evaluación)
echo "→ Ejecutando prueba_LB_20datos.py (visible para el profesor)..."
python3 prueba_LB_20datos.py

# 7. Simulador HTTP (en segundo plano)
echo "→ Ejecutando simulador_http.py..."
nohup python3 simulador_http.py > logs_simulador.log 2>&1 &

echo "✅ Sistema levantado. Puedes comprobar resultados en los ficheros logs_*.log o en pantalla."
