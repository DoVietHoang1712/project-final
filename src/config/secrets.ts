import { yellow } from "chalk";
import * as dotenv from "dotenv";

dotenv.config();

const env = (key: string, ignore: boolean = false): string => {
    const value = process.env[key];
    if (!ignore && value === undefined) {
        console.log(yellow(`[ENV] ${key} not found!`));
    }
    return value;
};

// Server
export const ENVIRONMENT = env("NODE_ENV");
export const PRODUCTION = ENVIRONMENT === "production";
export const DEVELOPMENT = ENVIRONMENT === "development";

export const SERVER_ADDRESS = env("SERVER_ADDRESS");
export const SERVER_PORT = env("SERVER_PORT");
export const JWT_SECRET = env("JWT_SECRET");
export const JWT_EXP = Number(env("JWT_EXP"));
export const PROJECT_NAME = env("PROJECT_NAME");
export const PROJECT_VERSION = env("PROJECT_VERSION");

// UI Avatar
export const AV_BACKGROUND_1 = env("AV_BACKGROUND_1");
export const AV_TEXT_1 = env("AV_TEXT_1");
export const AV_BACKGROUND_2 = env("AV_BACKGROUND_2");
export const AV_TEXT_2 = env("AV_TEXT_2");
export const DEFAULT_USER_PASSWORD = env("DEFAULT_USER_PASSWORD");

// Mongo
const MONGO_USERNAME = env("MONGO_USERNAME");
const MONGO_PASSWORD = encodeURIComponent(env("MONGO_PASSWORD"));
const MONGO_PORT = env("MONGO_PORT");
const MONGO_HOST = env("MONGO_HOST");
export const MONGO_DB = env("MONGO_DB");
export const DATABASE_URI = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

// Redis
export const REDIS_PORT = Number(env("REDIS_PORT"));
export const REDIS_HOST = env("REDIS_HOST");
export const REDIS_PASSWORD = env("REDIS_PASSWORD");

export const ONE_SIGNAL_APP_ID = env("ONE_SIGNAL_APP_ID");
export const ONE_SIGNAL_API_KEY = env("ONE_SIGNAL_API_KEY");
export const MAILER_EMAIL_ID = env("MAILER_EMAIL_ID");
export const MAILER_PASSWORD = env("MAILER_PASSWORD");

// Swagger
export const SWAGGER_PATH = env("SWAGGER_PATH");

// Third party Authentication
export const FACEBOOK_CLIENT_ID = env("FACEBOOK_CLIENT_ID");
export const FACEBOOK_CLIENT_SECRET = env("FACEBOOK_CLIENT_SECRET");
export const GOOGLE_CLIENT_ID = env("GOOGLE_CLIENT_ID");
export const GOOGLE_CLIENT_SECRET = env("GOOGLE_CLIENT_SECRET");

// AMAZON WEB SERVICE
export const AWS_REGION = env("AWS_REGION");
export const AWS_ACCESS_KEY_ID = env("AWS_ACCESS_KEY_ID");
export const AWS_SECRET_ACCESS_KEY = env("AWS_SECRET_ACCESS_KEY");

// MAILGUN SERVER
export const MAILGUN_API_KEY = env("MAILGUN_API_KEY");
export const MAILGUN_DOMAIN = env("MAILGUN_DOMAIN");
