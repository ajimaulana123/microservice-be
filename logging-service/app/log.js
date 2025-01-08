const express = require('express');
const Queue = require('bull');

const app = express();
const port = 5003;

// Inisialisasi Bull Queue
const logQueue = new Queue('logs');

// In-memory array untuk menyimpan log (opsional, bisa diganti dengan database)
let logs = [];

// Middleware untuk parsing body JSON
app.use(express.json());

// Worker untuk memproses log
logQueue.process(async (job) => {
  console.log('Processing log:', job.data);

  try {
    // Simulasi penyimpanan log
    if (Math.random() < 0.3) throw new Error('Random log processing error'); // Simulasi error
    logs.push(job.data); // Simpan log ke in-memory array
  } catch (err) {
    console.error('Log processing failed:', err.message);
    throw err; // Buat job masuk ke retry otomatis
  }
});

// Endpoint untuk menerima log dan menambahkannya ke queue
app.post('/log', async (req, res) => {
  const logEntry = req.body;

  try {
    await logQueue.add(logEntry); // Tambahkan log ke queue
    res.status(202).json({ message: 'Log diterima dan diproses' });
  } catch (err) {
    console.error('Failed to add log to queue:', err.message);
    res.status(500).json({ message: 'Failed to process log' });
  }
});

// Endpoint untuk mendapatkan semua log yang sudah diproses
app.get('/logs', (req, res) => {
  res.json(logs);
});

// Event listener untuk menangani error pada job
logQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err.message);
});

// Jalankan server
app.listen(port, () => {
  console.log(`Logging Service running on port ${port}`);
});
