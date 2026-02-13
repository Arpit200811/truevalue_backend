import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";
import orderRoutes from "./routes/order.routes";
import notificationRoutes from "./routes/notification.routes";
import ticketRoutes from "./routes/ticket.routes";
import analyticsRoutes from "./routes/analytics.routes";
import uploadRoutes from "./routes/upload.routes";
import settingRoutes from "./routes/setting.routes";
import brandRoutes from "./routes/brand.routes";
import reviewRoutes from "./routes/review.routes";
import offerRoutes from "./routes/offer.routes";
import bannerRoutes from "./routes/banner.routes";
import riderRoutes from "./routes/rider.routes";
import walletRoutes from "./routes/wallet.routes";
import zoneRoutes from "./routes/zone.routes";
import couponRoutes from "./routes/coupon.routes";
import automationRoutes from "./routes/automation.routes";
import path from "path";
import { loggerMiddleware } from "./middleware/logger.middleware";

import { seedDatabase } from "./controllers/SeedController";

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:19000", "https://truevalue-adminpanel.onrender.com"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(loggerMiddleware);
app.use(express.json({ strict: false }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/riders", riderRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/zones", zoneRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/automation", automationRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.get("/api/seed", seedDatabase);

// Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("❌ Backend Error:", err.stack || err.message);
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
        error: process.env.NODE_ENV === "development" ? err.message : {}
    });
});

export default app;
