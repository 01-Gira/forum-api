# backend/Dockerfile
FROM node:18-alpine

# Buat direktori kerja
WORKDIR /usr/src/app

# Copy package.json dan install dependencies
COPY package.json ./
RUN npm install

# Copy seluruh kode aplikasi
COPY . .

# Expose port aplikasi (sesuaikan jika berbeda)
EXPOSE 7003

# Jalankan aplikasi
CMD ["npm", "start"]
