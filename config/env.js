import { config } from "dotenv";
import process from "process";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const {
  PORT,
  NODE_ENV,
  DB_URI,
  JWT_EXPIRES,
  JWT_SECRET,
  ARCJET_KEY,
  ARCJET_ENV,
} = process.env;
