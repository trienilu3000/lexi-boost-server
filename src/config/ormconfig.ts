import "reflect-metadata";
import { DataSource } from "typeorm";

import * as path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: `${process.env.DB_PASS}` || "",
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: ["src/entities/*.ts"],
  migrations: ["src/migrations/*.ts"],
  migrationsTableName: 'migrations',
});
