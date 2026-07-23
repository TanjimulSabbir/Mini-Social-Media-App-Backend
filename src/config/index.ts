import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  node_env: process.env.NODE_ENV || "development",
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  clientOrigins: process.env.CLIENT_ORIGINS || [],
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET!,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET!,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN!,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN!,

    firebase_project_id: process.env.FIREBASE_PROJECT_ID!,
  firebase_client_email: process.env.FIREBASE_CLIENT_EMAIL!,
  firebase_private_key: process.env.FIREBASE_PRIVATE_KEY!,
};
