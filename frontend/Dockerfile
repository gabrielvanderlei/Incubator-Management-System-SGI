# Use uma imagem Node.js
FROM node:16.13

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia o package.json e o package-lock.json
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código
COPY . .
