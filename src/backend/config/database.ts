import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import * as models from "../models";

dotenv.config();

const dbHost = process.env.DB_HOST || "mysql-3363f9b7-gamesio-23.l.aivencloud.com";
const dbPort = parseInt(process.env.DB_PORT || "11443");
const dbName = process.env.DB_NAME || "defaultdb";
const dbUser = process.env.DB_USER || "avnadmin";
const dbPassword = process.env.DB_PASSWORD || "";
const dbSsl = process.env.DB_SSL === "true";

export const db = new Sequelize({
  database: dbName,
  dialect: "mysql",
  username: dbUser,
  password: dbPassword,
  host: dbHost,
  port: dbPort,
  models: Object.values(models).filter(m => typeof m === "function"),
  logging: false,
  dialectOptions: {
    ssl: dbSsl ? {
      rejectUnauthorized: false,
    } : false,
  },
});
