# Use uma imagem Node.js
FROM node:16.13

# Diretório de trabalho dentro do container
WORKDIR /app

EXPOSE 8080

# Copia o restante do código
COPY . .

# Instala as dependências
RUN npm install
RUN npm run generate

ENTRYPOINT npm i bcrypt && npm start
