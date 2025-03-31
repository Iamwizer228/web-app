import express from "express";
import { userRouter } from "./routers/users";
import { runMigrations } from "./migration/index"; 

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRouter);

const PORT = process.env.PORT ?? 3000;

runMigrations().then(() => {
  app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
  });
}).catch(error => {
  console.error("Ошибка при запуске сервера:", error);
});
