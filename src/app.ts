import express from 'express';
import userRouter from './router';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRouter);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
