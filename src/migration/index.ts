import { client } from "../clients/pg";

export const runMigrations = async () => {
  try {
    await client.connect();
    console.log("Миграция выполнена успешно.");
  } catch (error) {
    console.error("Ошибка при выполнении миграции:", error);
  } finally {
    await client.end();
  }
};
