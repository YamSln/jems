import { HttpHeader } from "../util/http.header";
import { HttpMethod } from "../util/http.method";
import { env } from ".";

const SERVER_HOST = env.HOST;
const SERVER_PORT = env.PORT;
const ALLOWED_ORIGIN = env.ORIGIN;
const VERSION = env.VERSION;
const ALLOWED_HEADERS = [
  HttpHeader.ORIGIN,
  HttpHeader.X_REQESTED_WITH,
  HttpHeader.CONTENT_TYPE,
  HttpHeader.ACCEPT,
  HttpHeader.AUTHORIZATION,
];
const METHODS = [
  HttpMethod.GET,
  HttpMethod.OPTIONS,
  HttpMethod.POST,
  HttpMethod.PUT,
  HttpMethod.PATCH,
  HttpMethod.DELETE,
];
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
  version: VERSION,
  allowedOrigin: ALLOWED_ORIGIN,
  allowedHeaders: ALLOWED_HEADERS,
  methods: METHODS,
  corsOptions: CORS_OPTIONS,
  ioOptions: IO_OPTIONS,
};

export default SERVER_CONFIG;
