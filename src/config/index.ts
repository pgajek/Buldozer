import path from "path";
import dotenv from "dotenv";

// Parsing the env file
dotenv.config({ path: path.resolve(__dirname, "../config/config.env") });

interface ENV {
  REDIS_HOST: string | undefined;
  REDIS_PORT: number | undefined;
  PORT: number | string | undefined;
}

interface Config {
  REDIS_HOST: string;
  REDIS_PORT: number;
  PORT: number | string;
}

const getConfig = (): ENV => {
  const redisPort = process.env.REDIS_PORT
    ? Number(process.env.REDIS_PORT)
    : 32771;

  const redisHost = process.env.REDIS_HOST
    ? process.env.REDIS_HOST
    : "localhost";

  const port = process.env.PORT ? process.env.PORT : 6919;

  return {
    REDIS_PORT: redisPort,
    REDIS_HOST: redisHost,
    PORT: port,
  };
};

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }

  return config as Config;
};

const config = getConfig();
const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;
