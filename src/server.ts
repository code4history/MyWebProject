import express from 'express';
import getConnection from './db.ts';

const app = express();
const port = 5174;

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.get('/api/getPrefCode', async (req, res) => {
  const { offset } = req.query;
  try {
    const session = await getConnection(); // データベース接続関数
    const sql = `SELECT pref_code FROM ${process.env.DB_SCHEMA!}.${process.env.DB_TABLE!} LIMIT 1 OFFSET ${offset}`;
    const queryResult = await session.sql(sql).execute();
    const results = queryResult.fetchAll();
    if (results.length > 0) {
      const [prefCode] = results[0];
      res.json({ prefCode });
    } else {
      res.status(404).json({ message: 'No data found' });
    }
  } catch (error) {
    console.error('Database query failed', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.use(express.static('dist'));

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

export default app;