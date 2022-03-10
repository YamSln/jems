function info(requestor: string, message: string, object?: any): void {
  object
    ? console.info(
        `[${currentTimeStamp()}] [INFO] [${requestor}] - ${message}`,
        object
      )
    : console.info(
        `[${currentTimeStamp()}] [INFO] [${requestor}] - ${message}`
      );
}

function debug(requestor: string, message: string, object?: any): void {
  object
    ? console.debug(
        `[${currentTimeStamp()}] [DEBUG] [${requestor}] - ${message}`,
        object
      )
    : console.debug(
        `[${currentTimeStamp()}] [DEBUG] [${requestor}] - ${message}`
      );
}

function warn(requestor: string, message: string, object?: any): void {
  object
    ? console.warn(
        `[${currentTimeStamp()}] [WARN] [${requestor}] - ${message}`,
        object
      )
    : console.warn(
        `[${currentTimeStamp()}] [WARN] [${requestor}] - ${message}`
      );
}

function error(requestor: string, message: string, object?: any): void {
  object
    ? console.error(
        `[${currentTimeStamp()}] [ERROR] [${requestor}] - ${message}`,
        object
      )
    : console.error(
        `[${currentTimeStamp()}] [ERROR] [${requestor}] - ${message}`
      );
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
