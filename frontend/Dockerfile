FROM node:18-alpine

WORKDIR /app

# Kopiowanie plików konfiguracyjnych
COPY package.json package-lock.json* ./

# Instalacja zależności
RUN npm install

# Kopiowanie kodu źródłowego
COPY . .

# Expose port dla Vite (domyślnie 5173, a nie 3000 jak w CRA)
EXPOSE 5173

# Uruchomienie aplikacji w trybie deweloperskim
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]