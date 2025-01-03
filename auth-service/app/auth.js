const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const port = 5001;

const SECRET_KEY = "your_secret_key";

// Middleware untuk mengurai body JSON
app.use(express.json());  // Ini perlu agar req.body bisa berisi data JSON

// Middleware untuk autentikasi token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Token is required');

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).send('Forbidden');
    req.user = user;
    next();
  });
};

// Route login untuk membuat token
app.post('/login', (req, res) => {
  const username = req.body.username;
  if (!username) return res.status(400).send('Username is required');

  const user = { name: username };
  const accessToken = jwt.sign(user, SECRET_KEY);
  res.json({ accessToken });
});

// Route profile untuk menampilkan data user setelah autentikasi
app.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.name}` });
});

app.listen(port, () => {
  console.log(`Authentication Service running on port ${port}`);
});
