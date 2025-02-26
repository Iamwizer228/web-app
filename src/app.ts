import express, { Request, Response} from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
