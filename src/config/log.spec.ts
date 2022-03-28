import fs, { WriteStream } from "fs";
import { logTest } from "./log";

const mocked = jest.mock("fs");

describe("Logger Unit Tests", () => {
  beforeAll(() => {
    logTest.info("UNIT TESTS", "------- Tests ------");
    const mockWriteStream = {
      on: jest.fn().mockImplementation(function (this, event) {
        return this;
      }),
    };
    mocked
      .spyOn(fs, "createWriteStream")
      .mockReturnValue(mockWriteStream as unknown as WriteStream);
  });
  afterAll(() => {
    logTest.info("UNIT TESTS", "------- Done ------");
  });
  it("should create write stream and write to log file", () => {
    logTest.writeLog("test");
  });
  it("should log info without object", () => {
    let logged;
    console.info = (message: string, params: []) => {
      logged = message;
    };

    logTest.info("TEST", "test");

    expect(logged).toContain("[INFO]");
    expect(logged).toContain("[TEST]");
    expect(logged).toContain("test");
  });
  it("should log info with object", () => {
    let logged;
    console.info = (message: string, params: []) => {
      logged = message + " " + params;
    };

    const logObject = { err: "err" };
    logTest.info("TEST", "test", logObject);

    expect(logged).toContain("[INFO]");
    expect(logged).toContain("[TEST]");
    expect(logged).toContain("test");
    expect(logged).toContain(logObject);
  });
  it("should log debug without object", () => {
    let logged;
    console.debug = (message: string, params: []) => {
      logged = message;
    };

    logTest.debug("TEST", "test");

    expect(logged).toContain("[DEBUG]");
    expect(logged).toContain("[TEST]");
    expect(logged).toContain("test");
  });
  it("should log debug with object", () => {
    let logged;
    console.debug = (message: string, params: []) => {
      logged = message + " " + params;
    };

    const logObject = { err: "err" };
    logTest.debug("TEST", "test", logObject);

    expect(logged).toContain("[DEBUG]");
    expect(logged).toContain("[TEST]");
    expect(logged).toContain("test");
    expect(logged).toContain(logObject);
  });
  it("should log warn without object", () => {
    let logged;
    console.warn = (message: string, params: []) => {
      logged = message;
    };

    logTest.warn("TEST", "test");

    expect(logged).toContain("[WARN]");
    expect(logged).toContain("[TEST]");
    expect(logged).toContain("test");
  });
  it("should log warn with object", () => {
    let logged;
    console.warn = (message: string, params: []) => {
      logged = message + " " + params;
    };

    const logObject = { err: "err" };
    logTest.warn("TEST", "test", logObject);

    expect(logged).toContain("[WARN]");
    expect(logged).toContain("[TEST]");
    expect(logged).toContain("test");
    expect(logged).toContain(logObject);
  });
  it("should log error without object", () => {
    let logged;
    console.error = (message: string, params: []) => {
      logged = message;
    };

    logTest.error("TEST", "test");

    expect(logged).toContain("[ERROR]");
    expect(logged).toContain("[TEST]");
    expect(logged).toContain("test");
  });
  it("should log error with object", () => {
    let logged;
    console.error = (message: string, params: []) => {
      logged = message + " " + params;
    };

    const logObject = { err: "err" };
    logTest.error("TEST", "test", logObject);

    expect(logged).toContain("[ERROR]");
    expect(logged).toContain("[TEST]");
    expect(logged).toContain("test");
    expect(logged).toContain(logObject);
  });
});
