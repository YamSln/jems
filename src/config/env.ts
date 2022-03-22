import { config } from "dotenv";

export const configEnv = (): void => {
  if (devEnv()) {
    config();
  }
};

export const devEnv = (): boolean => {
  return process.env.NODE_ENV !== "prod";
};
