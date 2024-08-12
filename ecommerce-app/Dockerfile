# Dockerfile

# Usa una imagen base oficial de Node.js.
FROM node:18

# Establece el directorio de trabajo dentro del contenedor.
WORKDIR /app

# Copia el archivo package.json y package-lock.json.
COPY package*.json ./

# Instala las dependencias del proyecto.
RUN npm install

# Copia el resto del código fuente.
COPY . .

# Expone el puerto en el que la aplicación correrá.
EXPOSE 3000

# Comando para correr la aplicación en modo desarrollo.
CMD ["npm", "run", "dev"]
