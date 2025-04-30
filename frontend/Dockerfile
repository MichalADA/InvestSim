# frontend/Dockerfile
FROM node:16-alpine

WORKDIR /app

# Kopiowanie plików zależności
COPY package.json package-lock.json* ./

# Instalacja zależności
RUN npm install

# Kopiowanie kodu źródłowego
COPY . .

# Odsłonięcie portu
EXPOSE 3000

# Uruchomienie aplikacji w trybie deweloperskim
CMD ["npm", "start"]