import log from "./log";

describe("Logger Unit Tests", () => {
  describe("Log Info", () => {
    it("should log info message", () => {
      let logs: string[] = [];
      console.info = (message: string) => {
        logs.push(message);
      };
      log.info("LOG INFO UNIT TEST", "log info unit test");
      expect(logs[0].indexOf("[INFO]") !== -1).toBeTruthy(); // Log type
      expect(logs[0].indexOf("[LOG INFO UNIT TEST]") !== -1).toBeTruthy(); // Log requestor
      expect(logs[0].indexOf("log info unit test") !== -1).toBeTruthy(); // Log message
    });
    it("should log info message with object", () => {
      let logs: string[] = [];
      let params: object[] = [];
      console.info = (message: string, optionalParams: object[]) => {
        logs.push(message);
        params = optionalParams;
      };
      log.info("LOG INFO UNIT TEST", "log info unit test", "trace");
      expect(logs[0].indexOf("[INFO]") !== -1).toBeTruthy(); // Log type
      expect(logs[0].indexOf("[LOG INFO UNIT TEST]") !== -1).toBeTruthy(); // Log requestor
      expect(logs[0].indexOf("log info unit test") !== -1).toBeTruthy(); // Log message
      expect(params).toEqual("trace"); // Log object
    });
  });

  describe("Log Debug", () => {
    it("should log debug message", () => {
      let logs: string[] = [];
      console.debug = (message: string) => {
        logs.push(message);
      };
      log.debug("LOG DEBUG UNIT TEST", "log debug unit test");
      expect(logs[0].indexOf("[DEBUG]") !== -1).toBeTruthy();
      expect(logs[0].indexOf("[LOG DEBUG UNIT TEST]") !== -1).toBeTruthy();
      expect(logs[0].indexOf("log debug unit test") !== -1).toBeTruthy();
    });
    it("should log debug message with object", () => {
      let logs: string[] = [];
      let params: object[] = [];
      console.debug = (message: string, optionalParams: object[]) => {
        logs.push(message);
        params = optionalParams;
      };
      log.debug("LOG DEBUG UNIT TEST", "log debug unit test", "trace");
      expect(logs[0].indexOf("[DEBUG]") !== -1).toBeTruthy();
      expect(logs[0].indexOf("[LOG DEBUG UNIT TEST]") !== -1).toBeTruthy();
      expect(logs[0].indexOf("log debug unit test") !== -1).toBeTruthy();
      expect(params).toEqual("trace");
    });
  });

  describe("Log Warn", () => {
    it("should log warn message", () => {
      let logs: string[] = [];
      console.warn = (message: string) => {
        logs.push(message);
      };
      log.warn("LOG WARN UNIT TEST", "log warn unit test");
      expect(logs[0].indexOf("[WARN]") !== -1).toBeTruthy();
      expect(logs[0].indexOf("[LOG WARN UNIT TEST]") !== -1).toBeTruthy();
      expect(logs[0].indexOf("log warn unit test") !== -1).toBeTruthy();
    });
    it("should log warn message with object", () => {
      let logs: string[] = [];
      let params: object[] = [];
      console.warn = (message: string, optionalParams: object[]) => {
        logs.push(message);
        params = optionalParams;
      };
      log.warn("LOG WARN UNIT TEST", "log warn unit test", "trace");
      expect(logs[0].indexOf("[WARN]") !== -1).toBeTruthy();
      expect(logs[0].indexOf("[LOG WARN UNIT TEST]") !== -1).toBeTruthy();
      expect(logs[0].indexOf("log warn unit test") !== -1).toBeTruthy();
      expect(params).toEqual("trace");
    });
  });

  describe("Log Error", () => {
    it("should log error message", () => {
      let logs: string[] = [];
      console.error = (message: string) => {
        logs.push(message);
      };
      log.error("LOG ERROR UNIT TEST", "log error unit test");
      expect(logs[0].indexOf("[ERROR]") !== -1).toBeTruthy();
      expect(logs[0].indexOf("[LOG ERROR UNIT TEST]") !== -1).toBeTruthy();
      expect(logs[0].indexOf("log error unit test") !== -1).toBeTruthy();
    });
    it("should log error message with object", () => {
      let logs: string[] = [];
      let params: object[] = [];
      console.error = (message: string, optionalParams: object[]) => {
        logs.push(message);
        params = optionalParams;
      };
      log.error("LOG ERROR UNIT TEST", "log error unit test", "trace");
      expect(logs[0].indexOf("[ERROR]") !== -1).toBeTruthy();
      expect(logs[0].indexOf("[LOG ERROR UNIT TEST]") !== -1).toBeTruthy();
      expect(logs[0].indexOf("log error unit test") !== -1).toBeTruthy();
      expect(params).toEqual("trace");
    });
  });
});
