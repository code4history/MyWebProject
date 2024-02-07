import express from 'express';
import getConnection from './lib/db.ts';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });
const port = 3000;

// WebSocket接続のハンドリング
wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log('受信メッセージ:', message);
    const seconds = parseInt(message.toString());
    setTimeout(() => {
      ws.send(`${seconds}秒が経過しました`);
    }, seconds * 1000);
  });

  ws.send('WebSocket接続が確立されました');
});

app.get('/stones/api/hello', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.get('/stones/api/getPrefCode', async (req, res) => {
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

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

export default app;