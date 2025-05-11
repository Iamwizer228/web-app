import { Router, Request, Response } from "express";
import { client } from "../clients/pg"; 
import { body, param, validationResult } from 'express-validator';
import { createRouteHandler } from "../utils/routeHandler";

export const userRouter = Router();


const validate = (req: Request, res: Response, next: Function) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

userRouter.get("/", createRouteHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await client.query("SELECT * FROM users");
  res.json(result.rows);
}));

userRouter.get(
  "/:id",
  [
    param('id').isInt({ min: 1 }).withMessage("Неверный ID пользователя"),
    validate
  ],
  createRouteHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);

    const result = await client.query("SELECT * FROM users WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      res.status(404).send("Пользователь не найден");
      return;
    }

    res.json(result.rows[0]);
  })
);

userRouter.post(
  "/",
  [
    body('name').isString().notEmpty().withMessage("Имя обязательно"),
    validate
  ],
  createRouteHandler(async (req: Request, res: Response): Promise<void> => {
    const { name } = req.body;
    const result = await client.query("INSERT INTO users (name) VALUES ($1) RETURNING *", [name]);
    res.status(201).json(result.rows[0]);
  })
);

userRouter.put(
  "/:id",
  [
    param('id').isInt({ min: 1 }).withMessage("Неверный ID пользователя"),
    body('name').isString().notEmpty().withMessage("Имя обязательно"),
    validate
  ],
  createRouteHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    const { name } = req.body;
    
    const result = await client.query("UPDATE users SET name = $1 WHERE id = $2", [name, id]);
    if (result.rowCount === 0) {
      res.status(404).send("Пользователь не найден");
      return; 
    }
    res.json({ id, name });
  })
);

userRouter.delete(
  "/:id",
  [
    param('id').isInt({ min: 1 }).withMessage("Неверный ID пользователя"),
    validate
  ],
  createRouteHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    
    const result = await client.query("DELETE FROM users WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      res.status(404).send("Пользователь не найден");
      return;
    }

    res.status(204).send();
  })
);