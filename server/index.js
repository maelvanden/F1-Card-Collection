import dotenv from 'dotenv';
import express from 'express';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import path from 'path';

dotenv.config();

const app = express();
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);
app.use(express.json());
app.use(express.static('dist'));

const DATABASE_URL = process.env.DATABASE_URL;
const DB_PATH = process.env.DB_PATH || 'data.sqlite';
const MYSQL_HOST = process.env.MYSQL_HOST;
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
const MYSQL_DATABASE = process.env.MYSQL_DATABASE;
const MYSQL_PORT = process.env.MYSQL_PORT;

let db;
const useMySQL = Boolean(MYSQL_HOST);
const usePostgres = !useMySQL && Boolean(DATABASE_URL);

if (useMySQL) {
  const mysql = await import('mysql2/promise');
  db = await mysql.createPool({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    port: MYSQL_PORT ? Number(MYSQL_PORT) : 3306,
  });
  await db.query(`CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255) NOT NULL,
    speedCoins INT DEFAULT 0,
    registrationDate VARCHAR(255),
    avatarUrl VARCHAR(255),
    bannerUrl VARCHAR(255),
    bio TEXT
  )`);
} else if (usePostgres) {
  const pg = await import('pg');
  const { Pool } = pg;
  db = new Pool({ connectionString: DATABASE_URL });
  await db.query(`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT NOT NULL,
    speedCoins INTEGER DEFAULT 0,
    registrationDate TEXT,
    avatarUrl TEXT,
    bannerUrl TEXT,
    bio TEXT
  )`);
} else {
  db = new Database(DB_PATH);
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
}

const { JWT_SECRET } = process.env;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

app.post('/api/register', async (req, res) => {
  const { username, email, password, avatarUrl = '', bannerUrl = '', bio = '' } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  try {
    if (useMySQL) {
      const [existing] = await db.execute('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);
      if (existing.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }
      const hashed = await bcrypt.hash(password, 10);
      const registrationDate = new Date().toISOString();
      const [result] = await db.execute(
        'INSERT INTO users (username, email, password, speedCoins, registrationDate, avatarUrl, bannerUrl, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [username, email, hashed, 0, registrationDate, avatarUrl, bannerUrl, bio]
      );
      const user = {
        id: String(result.insertId),
        username,
        email,
        speedCoins: 0,
        registrationDate,
        avatarUrl,
        bannerUrl,
        bio,
      };
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, user });
    } else if (usePostgres) {
      const existing = await db.query('SELECT id FROM users WHERE email = $1 OR username = $2', [email, username]);
      if (existing.rows.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }
      const hashed = await bcrypt.hash(password, 10);
      const registrationDate = new Date().toISOString();
      const result = await db.query(
        'INSERT INTO users (username, email, password, speedCoins, registrationDate, avatarUrl, bannerUrl, bio) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
        [username, email, hashed, 0, registrationDate, avatarUrl, bannerUrl, bio]
      );
      const user = {
        id: String(result.rows[0].id),
        username,
        email,
        speedCoins: 0,
        registrationDate,
        avatarUrl,
        bannerUrl,
        bio,
      };
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, user });
    } else {
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
    }
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
    let row;
    if (useMySQL) {
      const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
      row = rows[0];
    } else if (usePostgres) {
      const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      row = result.rows[0];
    } else {
      row = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    }
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

app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    let row;
    if (useMySQL) {
      const [rows] = await db.execute(
        'SELECT id, username, email, speedCoins, registrationDate, avatarUrl, bannerUrl, bio FROM users WHERE id = ?',
        [req.userId]
      );
      row = rows[0];
    } else if (usePostgres) {
      const result = await db.query(
        'SELECT id, username, email, speedCoins, registrationDate, avatarUrl, bannerUrl, bio FROM users WHERE id = $1',
        [req.userId]
      );
      row = result.rows[0];
    } else {
      row = db
        .prepare(
          'SELECT id, username, email, speedCoins, registrationDate, avatarUrl, bannerUrl, bio FROM users WHERE id = ?'
        )
        .get(req.userId);
    }
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

app.put('/api/profile', authMiddleware, async (req, res) => {
  const { avatarUrl = '', bannerUrl = '', bio = '' } = req.body;
  try {
    let row;
    if (useMySQL) {
      await db.execute('UPDATE users SET avatarUrl = ?, bannerUrl = ?, bio = ? WHERE id = ?', [
        avatarUrl,
        bannerUrl,
        bio,
        req.userId,
      ]);
      const [rows] = await db.execute(
        'SELECT id, username, email, speedCoins, registrationDate, avatarUrl, bannerUrl, bio FROM users WHERE id = ?',
        [req.userId]
      );
      row = rows[0];
    } else if (usePostgres) {
      await db.query('UPDATE users SET avatarUrl = $1, bannerUrl = $2, bio = $3 WHERE id = $4', [
        avatarUrl,
        bannerUrl,
        bio,
        req.userId,
      ]);
      const result = await db.query(
        'SELECT id, username, email, speedCoins, registrationDate, avatarUrl, bannerUrl, bio FROM users WHERE id = $1',
        [req.userId]
      );
      row = result.rows[0];
    } else {
      db.prepare('UPDATE users SET avatarUrl = ?, bannerUrl = ?, bio = ? WHERE id = ?').run(
        avatarUrl,
        bannerUrl,
        bio,
        req.userId
      );
      row = db
        .prepare('SELECT id, username, email, speedCoins, registrationDate, avatarUrl, bannerUrl, bio FROM users WHERE id = ?')
        .get(req.userId);
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
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve('dist/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
