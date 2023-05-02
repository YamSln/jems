const DEV_ENV = process.env.NODE_ENV !== "production";
const HOST = process.env.HOST || "localhost";
const PORT = Number(process.env.PORT) || 3000;
const ORIGIN = process.env.ORIGIN || "*";
const VERSION = process.env.npm_package_version;

export default { DEV_ENV, HOST, PORT, ORIGIN, VERSION };
