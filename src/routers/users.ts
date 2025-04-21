import { Router, Request, Response } from "express";
import { client } from "../clients/pg"; 
import { body, validationResult } from 'express-validator';
import { createRouteHandler } from "../utils/routeHandler"; 

export const userRouter = Router();

const validateId = (id: string): boolean => {
  const parsedId = parseInt(id, 10);
  return !isNaN(parsedId) && parsedId > 0;
};

userRouter.get("/", createRouteHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await client.query("SELECT * FROM users");
  res.json(result.rows);
}));

userRouter.get("/:id", createRouteHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!validateId(id)) {
    res.status(400).send("Неверный ID пользователя");
    return; 
  }

  const result = await client.query("SELECT * FROM users WHERE id = \$1", [id]);
  if (result.rows.length === 0) {
    res.status(404).send("Пользователь не найден");
    return;
  }
  
  res.json(result.rows[0]);
}));

userRouter.post("/", [
  body('name').isString().notEmpty().withMessage('Имя должно быть непустой строкой')
], createRouteHandler(async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return; 
  }

  const { name } = req.body;
  const result = await client.query("INSERT INTO users (name) VALUES (\$1) RETURNING *", [name]);
  res.status(201).json(result.rows[0]);
}));

userRouter.put("/:id", [
  body('name').isString().notEmpty().withMessage('Имя должно быть непустой строкой')
], createRouteHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!validateId(id)) {
    res.status(400).send("Неверный ID пользователя");
    return; 
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return; 
  }

  const { name } = req.body;
  const result = await client.query("UPDATE users SET name = \$1 WHERE id = \$2 RETURNING *", [name, id]);
  if (result.rows.length === 0) {
    res.status(404).send("Пользователь не найден");
    return; 
  }
  
  res.json(result.rows[0]);
}));

userRouter.delete("/:id", createRouteHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!validateId(id)) {
    res.status(400).send("Неверный ID пользователя");
    return; 
  }

  const result = await client.query("DELETE FROM users WHERE id = \$1 RETURNING *", [id]);
  if (result.rows.length === 0) {
    res.status(404).send("Пользователь не найден");
    return; 
  }
  
  res.status(204).send(); 
}));

