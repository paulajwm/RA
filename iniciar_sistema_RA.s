#!/bin/bash

echo "=========================="
echo " INICIANDO SISTEMA COMPLETO"
echo "=========================="

# 1. Lanzar el middleware Node.js
echo "→ Iniciando app.js (middleware)..."
cd ~/RA/SSR-master-server-main
nohup node app.js > ../logs_app.log 2>&1 &
cd ~/RA

# 2. Lanzar Leaky Bucket LB1
echo "→ Iniciando Leaky Bucket LB1 en puerto 5000..."
PORT=5000 NOMBRE=LB1 BACKEND=http://10.100.0.102:3000/record nohup node leaky_bucket_instance1.js > logs_LB1.log 2>&1 &

# 3. Lanzar Leaky Bucket LB2
echo "→ Iniciando Leaky Bucket LB2 en puerto 5001..."
PORT=5001 NOMBRE=LB2 BACKEND=http://10.100.0.102:3001/record nohup node leaky_bucket_instance2.js > logs_LB2.log 2>&1 &

# 4. Lanzar script Python que mete en MySQL
echo "→ Ejecutando mqtt_to_sql.py..."
nohup python3 mqtt_to_sql.py > logs_sql.log 2>&1 &

# 5. Lanzar el servidor del servicio termómetro
echo "→ Ejecutando servicio REST termómetro..."
cd ~/RA/termometro
nohup node server.js > ../logs_termometro.log 2>&1 &
cd ~/RA

# 6. Lanzar prueba de Leaky Bucket
echo "→ Ejecutando prueba_LB_20datos.py..."
nohup python3 prueba_LB_20datos.py > logs_pruebaLB.log 2>&1 &

# 7. Lanzar simulador que pasa por el HAProxy
echo "→ Ejecutando simulador_http.py..."
nohup python3 simulador_http.py > logs_simulador.log 2>&1 &

echo "✅ Todo está en marcha. Revisa los archivos logs_*.log si quieres ver la salida."
