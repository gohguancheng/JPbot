import { config } from "dotenv";
import { cleanEnv, str, num } from "envalid";

config();

export const env = cleanEnv(process.env, {
  DOMAIN: str({ devDefault: "" }),
  PORT: num({ default: 4000 }),
  TEST_TOKEN: str({ default: "" }),
  JP_TOKEN: str({ devDefault: "" }),
  SUPER_USER_ID: num({ default: 0 }),
  SUPER_J_ID: num(),
  DEBUG: str({ default: "" }),
  NODE_ENV: str({ choices: ["development", "production"] }),
  SERVICE_PRIVATE_KEY: str(),
  SERVICE_ACCOUNT_EMAIL: str(),
  SPREADSHEET_ID: str(),
});
