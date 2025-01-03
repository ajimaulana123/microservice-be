# Microservice Project with Docker and Nginx

## Deskripsi

Proyek ini bertujuan untuk membangun dan mengelola beberapa microservices sederhana menggunakan Docker dan Nginx sebagai reverse proxy. Setiap service berjalan dalam container Docker yang terisolasi dan dapat berkomunikasi satu sama lain dengan mudah melalui jaringan Docker.

### Microservices:

1. **Service A - Authentication**: Mengelola login dan logout menggunakan token JWT.
2. **Service B - Data Service**: Menyediakan API untuk CRUD (Create, Read, Update, Delete) data pengguna.
3. **Service C - Logging**: Mencatat dan menyimpan log untuk setiap request dan response yang terjadi di microservices lain.
4. **Nginx**: Reverse proxy untuk routing antar services.

## Teknologi yang Digunakan

- **Docker**: Untuk membuat container yang menjalankan microservices.
- **Docker Compose**: Untuk mengelola dan mengatur dependency antar services.
- **Nginx**: Sebagai reverse proxy untuk mengarahkan request ke microservices yang tepat.
- **Express.js**: Framework Node.js yang digunakan untuk membuat RESTful API pada setiap microservice.
- **JWT (JSON Web Token)**: Untuk autentikasi pada Service A.

## Cara Menjalankan Proyek

### Prasyarat

1. Pastikan Docker dan Docker Compose sudah terinstal di mesin kamu. Kamu bisa mengunduhnya di [Docker](https://www.docker.com/get-started) dan [Docker Compose](https://docs.docker.com/compose/install/).

### Menjalankan Semua Service

1. Clone repository ini ke mesin lokal kamu:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Bangun dan jalankan semua services menggunakan Docker Compose:
   ```bash
   docker-compose up --build
   ```

   Perintah ini akan membangun image Docker untuk setiap microservice dan menjalankan container-nya.

### Mengakses API

- **Authentication Service**:
  - Endpoint: `http://localhost/auth/login`
  - Method: `POST`
  - Body:
    ```json
    {
      "username": "john"
    }
    ```
  - Response: 
    ```json
    {
      "accessToken": "<your-token>"
    }
    ```

- **Data Service**:
  - Endpoint: `http://localhost/data`
  - Method: `GET`
  - Headers: `Authorization: Bearer <your-token>`
  - Response: Daftar data pengguna.

- **Logging Service**:
  - Endpoint: `http://localhost/logs`
  - Method: `GET`
  - Response: Log request dan response.

### Menjalankan Secara Terpisah

Jika ingin menjalankan service secara terpisah, kamu bisa menjalankan container yang sesuai:

- **Authentication Service**:
  ```bash
  docker run -p 5001:5001 auth-service
  ```

- **Data Service**:
  ```bash
  docker run -p 5002:5002 data-service
  ```

- **Logging Service**:
  ```bash
  docker run -p 5003:5003 logging-service
  ```

- **Nginx**:
  ```bash
  docker run -p 80:80 nginx
  ```

## Struktur Proyek

```
.
├── auth-service
│   ├── Dockerfile
│   ├── app.js
│   └── package.json
├── data-service
│   ├── Dockerfile
│   ├── app.js
│   └── package.json
├── logging-service
│   ├── Dockerfile
│   ├── app.js
│   └── package.json
├── nginx
│   ├── default.conf
├── docker-compose.yml
└── README.md
```

## Troubleshooting

- Jika kamu mengalami masalah dengan memory saat menjalankan container, pastikan untuk menyesuaikan konfigurasi Docker kamu.
- Pastikan semua port yang dibutuhkan (5001, 5002, 5003, 80) tidak digunakan oleh aplikasi lain di sistem kamu.

## Kontribusi

Jika kamu ingin berkontribusi atau mengembangkan proyek ini lebih lanjut, silakan fork dan kirim pull request.
