import { Router } from "express";
import { client } from "../clients/pg";
import { createRouteHandler } from "../utils/routeHandler";

export const userRouter = Router();

userRouter.get(
  "/",
  createRouteHandler(async (req, res) => {
    const result = await client.query("SELECT * FROM users");
    res.json(result.rows);
  })
);

userRouter.get(
  "/:id",
  createRouteHandler(async (req, res) => {
    const { id } = req.params;
    const result = await client.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      res.status(404).send("Пользователь не найден");
      return;
    }
    res.json(result.rows[0]);
  })
);

userRouter.post(
  "/",
  createRouteHandler(async (req, res) => {
    const { name } = req.body;
    const result = await client.query(
      "INSERT INTO users (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.status(201).json(result.rows[0]);
  })
);

userRouter.put(
  "/:id",
  createRouteHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const result = await client.query(
      "UPDATE users SET name = $1 WHERE id = $2 RETURNING *",
      [name, id]
    );
    if (result.rows.length === 0) {
      res.status(404).send("Пользователь не найден");
      return;
    }
    res.json(result.rows[0]);
  })
);

userRouter.delete(
  "/:id",
  createRouteHandler(async (req, res) => {
    const { id } = req.params;
    const result = await client.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      res.status(404).send("Пользователь не найден");
      return;
    }
    res.status(204).send();
  })
);
