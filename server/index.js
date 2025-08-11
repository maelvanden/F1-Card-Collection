import express from 'express';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const db = new Database('data.sqlite');

db.exec(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  email TEXT UNIQUE,
  password TEXT NOT NULL,
  speedCoins INTEGER DEFAULT 0,
  registrationDate TEXT,
  avatarUrl TEXT,
  bannerUrl TEXT,
  bio TEXT
)`);

try { db.prepare('ALTER TABLE users ADD COLUMN avatarUrl TEXT').run(); } catch {}
try { db.prepare('ALTER TABLE users ADD COLUMN bannerUrl TEXT').run(); } catch {}
try { db.prepare('ALTER TABLE users ADD COLUMN bio TEXT').run(); } catch {}

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

app.post('/api/register', async (req, res) => {
  const { username, email, password, avatarUrl = '', bannerUrl = '', bio = '' } = req.body;
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
    const stmt = db.prepare('INSERT INTO users (username, email, password, speedCoins, registrationDate, avatarUrl, bannerUrl, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    const info = stmt.run(username, email, hashed, 0, registrationDate, avatarUrl, bannerUrl, bio);
    const user = { id: String(info.lastInsertRowid), username, email, speedCoins: 0, registrationDate, avatarUrl, bannerUrl, bio };
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
      registrationDate: row.registrationDate,
      avatarUrl: row.avatarUrl || '',
      bannerUrl: row.bannerUrl || '',
      bio: row.bio || ''
    };
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

app.get('/api/profile', authMiddleware, (req, res) => {
  try {
    const row = db
      .prepare(
        'SELECT id, username, email, speedCoins, registrationDate, avatarUrl, bannerUrl, bio FROM users WHERE id = ?'
      )
      .get(req.userId);
    if (!row) {
      return res.status(404).json({ message: 'User not found' });
    }
    const user = {
      id: String(row.id),
      username: row.username,
      email: row.email,
      speedCoins: row.speedCoins,
      registrationDate: row.registrationDate,
      avatarUrl: row.avatarUrl || '',
      bannerUrl: row.bannerUrl || '',
      bio: row.bio || '',
    };
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/profile', authMiddleware, (req, res) => {
  const { avatarUrl = '', bannerUrl = '', bio = '' } = req.body;
  try {
    db.prepare('UPDATE users SET avatarUrl = ?, bannerUrl = ?, bio = ? WHERE id = ?').run(
      avatarUrl,
      bannerUrl,
      bio,
      req.userId
    );
    const row = db
      .prepare('SELECT id, username, email, speedCoins, registrationDate, avatarUrl, bannerUrl, bio FROM users WHERE id = ?')
      .get(req.userId);
    const user = {
      id: String(row.id),
      username: row.username,
      email: row.email,
      speedCoins: row.speedCoins,
      registrationDate: row.registrationDate,
      avatarUrl: row.avatarUrl || '',
      bannerUrl: row.bannerUrl || '',
      bio: row.bio || ''
    };
    res.json({ user });
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
