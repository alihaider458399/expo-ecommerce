import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import {ENV} from "./config/env.js";
import { connectDB } from "./config/db.js";
import { inngest, functions } from "./config/inngest.js";
import * as path from "node:path";
import adminRoutes from "./routes/admin.route.js";
import userRoutes from "./routes/user.route.js";
import orderRoute from "./routes/order.route.js";
import productRoute from "./routes/product.route.js";
import reviewRoute from "./routes/review.route.js";
import cartRoutes from "./routes/cart.routes.js";

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
app.use("/api/admin",adminRoutes)
app.use("/api/users",userRoutes)
app.use("/api/orders",orderRoute)
app.use("/api/products",productRoute)
app.use("/api/review",reviewRoute)
app.use("/api/cart",cartRoutes)

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
