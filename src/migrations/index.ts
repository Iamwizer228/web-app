import { client } from "../clients/pg";
import { createUsersTable } from "./create-users";

export const runMigrations = async () => {
  try {
    await client.connect();
    await createUsersTable();
    console.log("Миграция выполнена успешно.");
  } catch (error) {
    console.error("Ошибка при выполнении миграции:", error);
  } finally {
    await client.end();
  }
};