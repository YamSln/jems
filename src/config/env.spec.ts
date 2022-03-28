import env from "./env";

describe("Env configuration tests", () => {
  it("should return true when env is production, otherwise false", () => {
    const isDev = env.devEnv();

    expect(process.env.NODE_ENV === "production" ? !isDev : isDev).toBeTruthy();
  });
});
