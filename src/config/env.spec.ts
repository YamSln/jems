import { env } from ".";

describe("Env configuration tests", () => {
  it("should return true when env is production, otherwise false", () => {
    const isDev = env.DEV_ENV;

    expect(process.env.NODE_ENV === "production" ? !isDev : isDev).toBeTruthy();
  });
});
