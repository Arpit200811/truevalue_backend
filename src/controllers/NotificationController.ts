import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Notification } from "../entities/Notification";
import { EmailService } from "../services/EmailService";
import { PushNotificationService } from "../services/PushNotificationService";

export class NotificationController {
    private get notificationRepository() { return AppDataSource.getRepository(Notification); }

    async getAll(req: Request, res: Response) {
        try {
            const notifications = await this.notificationRepository.find({
                order: { createdAt: "DESC" } as any
            });
            return res.json(notifications);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching notifications", error });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const notification = this.notificationRepository.create(req.body as object);
            await this.notificationRepository.save(notification);

            // Trigger Push & Email if it's a Global broadcast
            if (notification.reach === "Global" || notification.status === "Sent") {
                await PushNotificationService.broadcastToAll(notification.title, notification.message);

                // If it's critical, send email as well
                if (notification.title.toLowerCase().includes("urgent") || notification.title.toLowerCase().includes("alert")) {
                    await EmailService.sendAdminAlert(notification.title, notification.message);
                }
            }

            return res.status(201).json(notification);
        } catch (error) {
            return res.status(500).json({ message: "Error sending notification", error });
        }
    }
}
