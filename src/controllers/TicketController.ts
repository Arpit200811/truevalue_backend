import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Ticket, TicketStatus } from "../entities/Ticket";
import { TicketReply } from "../entities/TicketReply";
import { EmailService } from "../services/EmailService";

export class TicketController {
    private get ticketRepository() { return AppDataSource.getRepository(Ticket); }
    private get replyRepository() { return AppDataSource.getRepository(TicketReply); }

    async getAll(req: Request, res: Response) {
        try {
            const tickets = await this.ticketRepository.find({
                relations: ["replies"],
                order: { createdAt: "DESC" } as any
            });
            return res.json(tickets);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching tickets", error });
        }
    }

    async reply(req: Request, res: Response) {
        try {
            const { message } = req.body;
            const ticketId = req.params.id as string;
            const ticket = await this.ticketRepository.findOneBy({ id: ticketId });
            if (!ticket) return res.status(404).json({ message: "Ticket not found" });

            const reply = this.replyRepository.create({
                ticket,
                message,
                senderType: "Admin"
            });
            await this.replyRepository.save(reply);

            // Send Email Notification to User
            await EmailService.sendEmail(
                "user@example.com", // In a real app, query user.email
                `Update on Ticket: ${ticket.subject}`,
                `Admin says: ${message}`
            );

            // Auto update status to In Progress if it was Open
            if (ticket.status === TicketStatus.OPEN) {
                ticket.status = TicketStatus.IN_PROGRESS;
                await this.ticketRepository.save(ticket);
            }

            return res.status(201).json(reply);
        } catch (error) {
            return res.status(500).json({ message: "Error replying to ticket", error });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const { user, subject, message, category, priority } = req.body;
            const ticket = this.ticketRepository.create({
                user,
                subject,
                message,
                category,
                priority
            });
            await this.ticketRepository.save(ticket);

            // Alert Admin via Email
            await EmailService.sendAdminAlert(
                `New Ticket: ${subject}`,
                `Priority: ${priority}\nFrom: ${user}\nMessage: ${message}`
            );

            return res.status(201).json(ticket);
        } catch (error) {
            return res.status(500).json({ message: "Error creating ticket", error });
        }
    }

    async updateStatus(req: Request, res: Response) {
        try {
            const { status } = req.body;
            let ticket = await this.ticketRepository.findOneBy({ id: req.params.id as string });
            if (!ticket) return res.status(404).json({ message: "Ticket not found" });

            if (Object.values(TicketStatus).includes(status)) {
                ticket.status = status;
                await this.ticketRepository.save(ticket);
                return res.json(ticket);
            } else {
                return res.status(400).json({ message: "Invalid status" });
            }
        } catch (error) {
            return res.status(500).json({ message: "Error updating ticket status", error });
        }
    }
}
