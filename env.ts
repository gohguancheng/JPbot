import { config } from "dotenv";
import { cleanEnv, str, num } from "envalid";

config();

export const env = cleanEnv(process.env, {
  DOMAIN: str({ devDefault: "" }),
  PORT: num({ default: 4000 }),
  TEST_TOKEN: str({ default: "" }),
  JP_TOKEN: str({ devDefault: "" }),
  SUPER_USER_ID: num({ default: 0 }),
  DEBUG: str({ default: "" }),
  NODE_ENV: str({ choices: ["development", "test", "production", "staging"] }),
});
