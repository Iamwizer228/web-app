
import { Router } from 'express';
import pool from './pg';
import { createRouteHandler } from './middleware';

const router = Router();

router.get('/users', createRouteHandler(async (req, res) => {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
}));

router.get('/users/:id', createRouteHandler(async (req, res) => {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM users WHERE id = \$1', [id]);
    if (result.rows.length === 0) {
        res.status(404).send('Пользователь не найден');
        return;
    }
    res.json(result.rows[0]);
}));

router.post('/users', createRouteHandler(async (req, res) => {
    const { name } = req.body;
    const result = await pool.query('INSERT INTO users (name) VALUES (\$1) RETURNING *', [name]);
    res.status(201).json(result.rows[0]);
}));

router.put('/users/:id', createRouteHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const result = await pool.query('UPDATE users SET name = \$1 WHERE id = \$2 RETURNING *', [name, id]);
    if (result.rows.length === 0) {
        res.status(404).send('Пользователь не найден');
        return;
    }
    res.json(result.rows[0]);
}));

router.delete('/users/:id', createRouteHandler(async (req, res) => {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM users WHERE id = \$1 RETURNING *', [id]);
    if (result.rows.length === 0) {
        res.status(404).send('Пользователь не найден');
        return;
    }
    res.status(204).send();
}));

router.get('/', (req, res) => {
    res.send('Hello, World!');
});

export default router;
