FROM python:3.11-slim

# Evita buffering para logs en tiempo real
ENV PYTHONUNBUFFERED=1

# Crea directorio de trabajo
WORKDIR /app

# Instala dependencias principales y system utilities
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto del código fuente
COPY . .

# Expone el puerto por defecto de FastAPI/Uvicorn
EXPOSE 5000

# Comando de arranque usando Uvicorn (servidor ASGI para FastAPI)
CMD ["uvicorn", "src.app:app", "--host", "0.0.0.0", "--port", "3002"]