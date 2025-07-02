FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-eng \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    redis-server \
    nginx \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements
COPY scripts/production_requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r production_requirements.txt

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p uploads processed logs

# Copy configuration files
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose ports
EXPOSE 80 5000 6379

# Set environment variables
ENV FLASK_APP=scripts/production_flask_app.py
ENV FLASK_ENV=production
ENV PYTHONPATH=/app

# Start services with supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
