import express from 'express';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

const db = new Database('data.sqlite');

db.exec(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  email TEXT UNIQUE,
  password TEXT NOT NULL,
  speedCoins INTEGER DEFAULT 0,
  registrationDate TEXT
)`);

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  try {
    const existing = db.prepare('SELECT id FROM users WHERE email = ? OR username = ?').get(email, username);
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const registrationDate = new Date().toISOString();
    const stmt = db.prepare('INSERT INTO users (username, email, password, speedCoins, registrationDate) VALUES (?, ?, ?, ?, ?)');
    const info = stmt.run(username, email, hashed, 0, registrationDate);
    const user = { id: String(info.lastInsertRowid), username, email, speedCoins: 0, registrationDate };
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  try {
    const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!row) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, row.password);
    if (!valid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const user = {
      id: String(row.id),
      username: row.username,
      email: row.email,
      speedCoins: row.speedCoins,
      registrationDate: row.registrationDate
    };
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
