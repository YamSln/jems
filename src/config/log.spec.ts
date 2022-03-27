import rewire from "rewire";
import fs from "fs";

const log = rewire("./log");

jest.mock("fs");

describe("Logger Unit Tests", () => {
  it("should create write stream and write to log file", () => {
    log.__get__("writeLog");
  });
});
