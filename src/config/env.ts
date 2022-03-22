export const devEnv = (): boolean => {
  return process.env.NODE_ENV !== "prod";
};
