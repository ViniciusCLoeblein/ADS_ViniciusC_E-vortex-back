FROM node:22-bullseye

WORKDIR /usr/src/app

ARG APP_NAME
COPY . .

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ && \
    apt-get remove --purge -y python3 make g++ && \
    apt-get autoremove -y && \
    apt-get clean \
    apt-get update && apt-get install -y \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxrandr2 \
    libgbm-dev \
    libasound2 \
    libpangocairo-1.0-0 \
    libpangoft2-1.0-0 \
    libgtk-3-0 \
    fonts-liberation \
    libnss3-dev \
    libxshmfence1 \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

RUN npm install --force  
RUN npm run build -- ${APP_NAME}

EXPOSE 3000