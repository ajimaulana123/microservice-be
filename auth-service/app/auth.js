const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const port = 5001;

const SECRET_KEY = "your_secret_key";

// Middleware untuk mengurai body JSON
app.use(express.json()); // Ini perlu agar req.body bisa berisi data JSON

// Middleware untuk autentikasi token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(403).send('Token is required');

  const token = authHeader.split(' ')[1]; // Ambil token dari header "Bearer TOKEN"
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).send('Invalid token');
    req.user = user;
    next();
  });
};

// Middleware untuk otorisasi berdasarkan role
const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ message: 'Forbidden: Insufficient role' });
    }
    next();
  };
};

// Route login untuk membuat token
app.post('/login', (req, res) => {
  const { username, role } = req.body;
  if (!username || !role) {
    return res.status(400).send('Username and role are required');
  }

  const user = { name: username, role }; // Tambahkan role ke payload token
  const accessToken = jwt.sign(user, SECRET_KEY, { expiresIn: '1h' }); // Token berlaku 1 jam
  res.json({ accessToken });
});

// Route profile untuk menampilkan data user setelah autentikasi
app.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.name}, your role is ${req.user.role}` });
});

// Route hanya untuk admin
app.delete('/admin/users/:id', authenticateToken, authorizeRole('admin'), (req, res) => {
  const userId = req.params.id;
  res.json({ message: `User ${userId} has been deleted by admin` });
});

// Route hanya untuk user biasa
app.get('/user/profile', authenticateToken, authorizeRole('user'), (req, res) => {
  res.json({ message: `Welcome, ${req.user.name}. This is your profile.` });
});

app.listen(port, () => {
  console.log(`Authentication Service running on port ${port}`);
});
