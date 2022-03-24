const devEnv = (): boolean => {
  return process.env.NODE_ENV !== "production";
};

export default { devEnv };
