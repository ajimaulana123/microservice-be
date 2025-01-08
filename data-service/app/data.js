const express = require('express');
const redis = require('redis');

const app = express();
const port = 5002;

// Middleware untuk parsing body JSON
app.use(express.json());

// Inisialisasi Redis
const client = redis.createClient();

client.on('error', (err) => console.error('Redis error:', err));

// Middleware untuk caching
const cacheMiddleware = (req, res, next) => {
  const userId = req.params.id;
  const cacheKey = `user:${userId}`;
  
  client.get(cacheKey, (err, data) => {
    if (err) {
      console.error('Redis get error:', err);
      return res.status(500).send('Internal Server Error');
    }
    if (data) {
      return res.json(JSON.parse(data));
    }
    next();
  });
};

// Data dummy
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Doe', email: 'jane@example.com' }
];

// Endpoint untuk mendapatkan semua pengguna
app.get('/users', (req, res) => {
  res.json(users);
});

// Endpoint untuk mendapatkan pengguna spesifik dengan caching
app.get('/users/:id', cacheMiddleware, (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);
  
  if (user) {
    const cacheKey = `user:${userId}`;
    
    // Simpan data pengguna ke Redis selama 1 jam (3600 detik)
    client.setex(cacheKey, 3600, JSON.stringify(user));
    res.json(user);
  } else {
    res.status(404).send('User not found');
  }
});

// Endpoint untuk menambah pengguna
app.post('/users', (req, res) => {
  const newUser = req.body;
  users.push(newUser);
  res.status(201).json(newUser);
});

// Endpoint untuk mengupdate pengguna
app.put('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);

  if (user) {
    user.name = req.body.name;
    user.email = req.body.email;

    // Update cache di Redis
    const cacheKey = `user:${userId}`;
    client.setex(cacheKey, 3600, JSON.stringify(user));
    
    res.json(user);
  } else {
    res.status(404).send('User not found');
  }
});

// Endpoint untuk menghapus pengguna
app.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  users = users.filter(u => u.id !== userId);

  // Hapus cache dari Redis
  const cacheKey = `user:${userId}`;
  client.del(cacheKey, (err) => {
    if (err) console.error('Redis delete error:', err);
  });

  res.status(204).send();
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Data Service running on port ${port}`);
});
