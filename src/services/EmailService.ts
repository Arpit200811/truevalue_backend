import nodemailer from "nodemailer";

export class EmailService {
    private static transporter = nodemailer.createTransport({
        service: "gmail", // Or your preferred service
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    static async sendEmail(to: string, subject: string, text: string, html?: string) {
        try {
            // If credentials are still placeholders, skip real sending to avoid errors
            if (process.env.EMAIL_USER?.includes("your-email")) {
                console.log("📧 [MOCK EMAIL] To:", to, "| Subject:", subject);
                return true;
            }

            await this.transporter.sendMail({
                from: `"TrueValue Admin" <${process.env.EMAIL_USER}>`,
                to,
                subject,
                text,
                html: html || text,
            });
            console.log("📧 Email sent successfully to:", to);
            return true;
        } catch (error) {
            console.error("❌ Email sending failed:", error);
            return false;
        }
    }

    static async sendAdminAlert(subject: string, message: string) {
        // Find admin email from settings or default
        const adminEmail = "admin@cloude.in"; // Fallback
        return this.sendEmail(adminEmail, `[ADMIN ALERT] ${subject}`, message);
    }
}
