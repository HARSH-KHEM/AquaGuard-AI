FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Default to 8080 if PORT is not set
ENV PORT=8080

# Cloud Run injects $PORT environment variable
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT}
