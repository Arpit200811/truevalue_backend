import * as admin from "firebase-admin";

export class PushNotificationService {
    private static initialized = false;

    private static init() {
        if (this.initialized) return;
        try {
            console.log("🔔 Push Notification Service Standby (Waiting for Firebase Config)");
        } catch (error) {
            console.error("❌ Push Notification Init Failed:", error);
        }
    }
    static async sendToTopic(topic: string, title: string, body: string, data?: any) {
        this.init();
        if (!this.initialized) {
            console.log(`🔔 [MOCK PUSH] Topic: ${topic} | Title: ${title} | Body: ${body}`);
            return;
        }
        const message = {
            notification: { title, body },
            topic,
            data: data || {}
        };

        try {
            await admin.messaging().send(message);
            console.log("🔔 Push notification sent to topic:", topic);
        } catch (error) {
            console.error("❌ Push notification failed:", error);
        }
    }
    static async broadcastToAll(title: string, body: string) {
        return this.sendToTopic("all_users", title, body);
    }
}
