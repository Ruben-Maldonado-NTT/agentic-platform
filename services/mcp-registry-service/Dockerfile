FROM python:3.11-slim

WORKDIR /app

# Copiamos todo el código de la app
COPY . .

# Instalamos las dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Ejecutamos la API
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8100"]
