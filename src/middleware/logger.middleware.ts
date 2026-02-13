import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

const logDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const logFile = path.join(logDir, "access.log");

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    const { method, url } = req;

    res.on("finish", () => {
        const duration = Date.now() - start;
        const status = res.statusCode;
        const log = `[${new Date().toISOString()}] ${method} ${url} ${status} - ${duration}ms\n`;

        fs.appendFile(logFile, log, (err) => {
            if (err) console.error("Logging error:", err);
        });

        if (status >= 400) {
            console.log(`❌ ${log.trim()}`);
        } else {
            console.log(`📡 ${log.trim()}`);
        }
    });

    next();
};
