
import 'dotenv/config';
import { Client } from 'pg'; 
import express, { Request, Response } from 'express';

const dbConfig = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT) || 5432, 
};

const client = new Client(dbConfig);

const app = express(); 
const port = process.env.PORT || 3000; 

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Если честно, я и не знаю, что написать'); 
});

async function startServer() {
  try {
    await client.connect(); 

    app.listen(port, () => {
      console.log(`Сервер запущен на http://127.0.0.1:${port}`);
    });

    const queryResult = await client.query('SELECT \$1::text AS message', ['Hello world!']);
    console.log(queryResult.rows[0].message); 

  } catch (error) {
    console.error('Ошибка при подключении к базе данных:', error);
  }
}

startServer().catch(console.error);

process.on('SIGINT', async () => {
  await client.end();
  console.log('Подключение к базе данных закрыто.');
  process.exit(0);
});
