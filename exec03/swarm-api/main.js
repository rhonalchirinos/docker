const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  host: process.env.PGHOST || 'postgres',
  user: 'postgres',
  password: process.env.PGPASSWORD || 'secret',
  database: 'postgres',
  port: 5432,
});

app.get('/', async (req, res) => {
  const result = await pool.query('SELECT NOW()');
  res.json({ message: 'Hello from API', time: result.rows[0].now });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`API running on port ${port}`);
});