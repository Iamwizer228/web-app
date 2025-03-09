import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
});

app.get('/users', async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

app.get('/users/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = \$1', [id]);
        if (result.rows.length === 0) {
            res.status(404).send('Пользователь не найден');
            return;
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

app.post('/users', async (req: Request, res: Response): Promise<void> => {
    const { name } = req.body;
    try {
        const result = await pool.query('INSERT INTO users (name) VALUES (\$1) RETURNING *', [name]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

app.put('/users/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const result = await pool.query('UPDATE users SET name = \$1 WHERE id = \$2 RETURNING *', [name, id]);
        if (result.rows.length === 0) {
            res.status(404).send('Пользователь не найден');
            return;
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

app.delete('/users/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM users WHERE id = \$1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            res.status(404).send('Пользователь не найден');
            return;
        }
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

app.get('/', (req: Request, res: Response): void => {
    res.send('Hello, World!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});

