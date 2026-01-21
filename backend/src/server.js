import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import {ENV} from "./config/env.js";
import { connectDB } from "./config/db.js";
import { inngest, functions } from "./config/inngest.js";
import * as path from "node:path";

// Load environment variables
dotenv.config();
const __dirname=path.resolve()
const app = express();
const PORT = process.env.PORT || 3000;

// Global middlewares
app.use(express.json());

// Public route
app.get("/api/health", (req, res) => {
    res.status(200).json({ message: "Welcome to the server!" });
});
if(ENV.NODE_ENV==="production") {
    app.use(express.static(path.join(__dirname, "../admin/dist")));
    app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, "../admin",
            "dist", "index.html"));
    })
}

// Auth middleware (protect routes below this)
app.use(clerkMiddleware());

// Inngest endpoint (must be AFTER middleware setup)
app.use(
    "/api/inngest",
    serve({
        client: inngest,
        functions,
    })
);

// Start server only after DB connection
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
