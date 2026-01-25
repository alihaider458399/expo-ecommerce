import dotenv from "dotenv"

dotenv.config()

export const ENV = {
    NODE_ENV: process.env.NODE_ENV,
    CLODINARY_CLOUD_NAME: process.env.CLODINARY_CLOUD_NAME,
    CLODINARY_SECRET_API: process.env.CLODINARY_SECRET_API,
    CLODINARY_API_KEY: process.env.CLODINARY_API_KEY,
    INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
    MONGO_URL: process.env.MONGO_URL,
    ADMIN_URL: process.env.ADMIN_EMAIL,
}