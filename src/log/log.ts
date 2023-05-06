import fs from "fs";
import { LogType } from "./log.type";

const logFile = fs.createWriteStream("debug.log", { flags: "a" });
info("SERVER", "Server is Starting");
info("LOGGER", "Initializing Log");

function info(requestor: string, message: string, object?: any): void {
  logMessage(requestor, message, LogType.INFO, object);
}

function debug(requestor: string, message: string, object?: any): void {
  logMessage(requestor, message, LogType.DEBUG, object);
}

function warn(requestor: string, message: string, object?: any): void {
  logMessage(requestor, message, LogType.WARN, object);
}

function error(requestor: string, message: string, object?: any): void {
  logMessage(requestor, message, LogType.ERROR, object);
}

function logMessage(
  requestor: string,
  message: string,
  logType: LogType,
  object?: any,
): void {
  const log = object
    ? `[${currentTimeStamp()}] [${logType}] [${requestor}] - ${message} : ${object}`
    : `[${currentTimeStamp()}] [${logType}] [${requestor}] - ${message}`;
  printLog(log, logType);
  writeLog(log);
}

function printLog(message: string, logType: LogType): void {
  switch (logType) {
    case LogType.DEBUG:
      console.debug(message);
      break;
    case LogType.WARN:
      console.warn(message);
      break;
    case LogType.ERROR:
      console.error(message);
      break;
    case LogType.INFO:
    default:
      console.log(message);
  }
}

function writeLog(message: string): void {
  logFile.write(message + "\r\n");
}

function currentTimeStamp(): string {
  return new Date().toISOString();
}

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
