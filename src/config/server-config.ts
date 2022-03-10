import { CorsOptions } from "cors";
import dotenv from "dotenv";

dotenv.config();

const DEV_ALLOWED_ORIGIN = "*";
const PROD_ALLOWED_ORIGIN = "TBD";

const SERVER_HOST = process.env.SERVER_HOST || "localhost";
const SERVER_PORT = process.env.SERVER_PORT || 3000;
const ALLOWED_ORIGIN =
  process.env.ENV === "production" ? PROD_ALLOWED_ORIGIN : DEV_ALLOWED_ORIGIN;

const CORS_OPTIONS: CorsOptions = {
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
  methods: ["GET", "OPTIONS", "POST", "PUT", "PATCH", "DELETE"],
  origin: ALLOWED_ORIGIN,
};

const SERVER = {
  hostName: SERVER_HOST,
  port: SERVER_PORT,
  allowedOrigin: ALLOWED_ORIGIN,
  corsOptions: CORS_OPTIONS,
  ioOptions: {
    pingInterval: 10000,
    pingTimeout: 5000,
    cors: { origin: ALLOWED_ORIGIN },
  },
};

export const serverConfig = {
  server: SERVER,
};
