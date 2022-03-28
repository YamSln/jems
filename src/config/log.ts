import fs from "fs";

const logFile = fs.createWriteStream("debug.log", { flags: "a" });

function writeLog(message: string) {
  logFile.write(message + "\r\n");
}

function info(requestor: string, message: string, object?: any): void {
  const log = object
    ? `[${currentTimeStamp()}] [INFO] [${requestor}] - ${message} : ${object}`
    : `[${currentTimeStamp()}] [INFO] [${requestor}] - ${message}`;
  console.info(log);
  writeLog(log);
}

info("LOGGER", "Initializing Log");

function debug(requestor: string, message: string, object?: any): void {
  const log = object
    ? `[${currentTimeStamp()}] [DEBUG] [${requestor}] - ${message} : ${object}`
    : `[${currentTimeStamp()}] [DEBUG] [${requestor}] - ${message}`;
  console.debug(log);
  writeLog(log);
}

function warn(requestor: string, message: string, object?: any): void {
  const log = object
    ? `[${currentTimeStamp()}] [WARN] [${requestor}] - ${message} : ${object}`
    : `[${currentTimeStamp()}] [WARN] [${requestor}] - ${message}`;
  console.warn(log);
  writeLog(log);
}

function error(requestor: string, message: string, object?: any): void {
  const log = object
    ? `[${currentTimeStamp()}] [ERROR] [${requestor}] - ${message} : ${object}`
    : `[${currentTimeStamp()}] [ERROR] [${requestor}] - ${message}`;
  console.error(log);
  writeLog(log);
}

function currentTimeStamp(): string {
  return new Date().toISOString();
}

info("SERVER", "Server is Starting");

export default {
  info,
  debug,
  warn,
  error,
};

export const logTest = {
  writeLog,
  info,
  debug,
  warn,
  error,
};
