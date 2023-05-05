import fs from "fs";
import { LogType } from "./log.type";

const logFile = fs.createWriteStream("debug.log", { flags: "a" });

const printLog = (message: string, logType: LogType): void => {
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
};

const writeLog = (message: string): void => {
  logFile.write(message + "\r\n");
};

const currentTimeStamp = (): string => {
  return new Date().toISOString();
};

const logMessage = (
  requestor: string,
  message: string,
  logType: LogType,
  object?: any,
): void => {
  const log = object
    ? `[${currentTimeStamp()}] [${logType}] [${requestor}] - ${message} : ${object}`
    : `[${currentTimeStamp()}] [${logType}] [${requestor}] - ${message}`;
  printLog(log, logType);
  writeLog(log);
};

const info = (requestor: string, message: string, object?: any): void => {
  logMessage(requestor, message, LogType.INFO, object);
};

info("LOGGER", "Initializing Log");

const debug = (requestor: string, message: string, object?: any): void => {
  logMessage(requestor, message, LogType.DEBUG, object);
};

const warn = (requestor: string, message: string, object?: any): void => {
  logMessage(requestor, message, LogType.WARN, object);
};

const error = (requestor: string, message: string, object?: any): void => {
  logMessage(requestor, message, LogType.ERROR, object);
};

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
