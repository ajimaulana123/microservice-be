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

Untuk melakukan **`curl`** ke microservices yang telah dibuat dengan Nginx sebagai reverse proxy, berikut adalah beberapa contoh perintah **curl** untuk masing-masing layanan:

#### **1. Authentication Service (Login dan Profile)**

- **Login (POST request untuk mendapatkan token JWT):**
  ```bash
  curl -X POST http://localhost/auth/login -d '{"username": "john"}' -H "Content-Type: application/json"
  ```

  Respons yang akan diberikan adalah token JWT seperti ini:
  ```json
  {
    "accessToken": "your_jwt_token_here"
  }
  ```

- **Akses Profile (GET request dengan JWT token):**
  Setelah mendapatkan token dari login, gunakan token tersebut untuk mengakses profile.
  ```bash
  curl -X GET http://localhost/auth/profile -H "Authorization: your_jwt_token_here"
  ```

  Respons:
  ```json
  {
    "message": "Welcome john"
  }
  ```

---

#### **2. Data Service (CRUD Data Pengguna)**

- **Ambil Data Pengguna (GET request):**
  ```bash
  curl -X GET http://localhost/data/users
  ```

  Respons yang akan diberikan adalah daftar pengguna:
  ```json
  [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    {
      "id": 2,
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  ]
  ```

- **Tambah Pengguna Baru (POST request):**
  ```bash
  curl -X POST http://localhost/data/users -d '{"id": 3, "name": "Alice", "email": "alice@example.com"}' -H "Content-Type: application/json"
  ```

  Respons:
  ```json
  {
    "id": 3,
    "name": "Alice",
    "email": "alice@example.com"
  }
  ```

- **Update Data Pengguna (PUT request):**
  ```bash
  curl -X PUT http://localhost/data/users/1 -d '{"name": "John Updated", "email": "john_updated@example.com"}' -H "Content-Type: application/json"
  ```

  Respons:
  ```json
  {
    "id": 1,
    "name": "John Updated",
    "email": "john_updated@example.com"
  }
  ```

- **Hapus Pengguna (DELETE request):**
  ```bash
  curl -X DELETE http://localhost/data/users/1
  ```

---

#### **3. Logging Service (Menyimpan dan Melihat Log)**

- **Menyimpan Log (POST request):**
  ```bash
  curl -X POST http://localhost/log/log -d '{"request": "/data/users", "response": "200 OK"}' -H "Content-Type: application/json"
  ```

  Respons:
  ```json
  "Log saved"
  ```

- **Lihat Log (GET request):**
  ```bash
  curl -X GET http://localhost/log/logs
  ```

  Respons:
  ```json
  [
    {
      "request": "/data/users",
      "response": "200 OK"
    }
  ]
  ```
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
