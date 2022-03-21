import dotenv from "dotenv";

dotenv.config();

const SERVER_HOST = process.env.SERVER_HOST || "localhost";
const SERVER_PORT = process.env.SERVER_PORT || 3000;
const IS_DEV = process.env.ENV == "dev";
const ALLOWED_ORIGIN = "*";

const SERVER = {
  hostName: SERVER_HOST,
  port: SERVER_PORT,
  allowedOrigin: IS_DEV ? ALLOWED_ORIGIN : undefined,
  corsOptions: IS_DEV
    ? {
        allowedHeaders: [
          "Origin",
          "X-Requested-With",
          "Content-Type",
          "Accept",
          "Authorization",
        ],
        methods: ["GET", "OPTIONS", "POST", "PUT", "PATCH", "DELETE"],
        origin: ALLOWED_ORIGIN,
      }
    : undefined,
  ioOptions: {
    pingInterval: 2000,
    pingTimeout: 5000,
    cors: IS_DEV ? { origin: ALLOWED_ORIGIN } : undefined,
  },
};

export const serverConfig = {
  server: SERVER,
};
