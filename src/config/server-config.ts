import env from "./env";

const SERVER_HOST = env.HOST;
const SERVER_PORT = env.PORT;
const ALLOWED_ORIGIN = env.ORIGIN;
const ALLOWED_HEADERS = [
  "Origin",
  "X-Requested-With",
  "Content-Type",
  "Accept",
  "Authorization",
];
const METHODS = ["GET", "OPTIONS", "POST", "PUT", "PATCH", "DELETE"];
const CORS_OPTIONS = {
  allowedHeaders: ALLOWED_HEADERS,
  methods: METHODS,
  origin: ALLOWED_ORIGIN,
};

const IO_OPTIONS = {
  pingInterval: 2000,
  pingTimeout: 5000,
  cors: CORS_OPTIONS,
};

const SERVER_CONFIG = {
  hostName: SERVER_HOST,
  port: SERVER_PORT,
  allowedOrigin: ALLOWED_ORIGIN,
  allowedHeaders: ALLOWED_HEADERS,
  methods: METHODS,
  corsOptions: CORS_OPTIONS,
  ioOptions: IO_OPTIONS,
};

export default SERVER_CONFIG;
