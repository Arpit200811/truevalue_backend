import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn
} from "typeorm";
import { Ticket } from "./Ticket";

@Entity()
export class TicketReply {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Ticket, (ticket) => ticket.replies)
    ticket!: Ticket;

    @Column("text")
    message!: string;

    @Column({ default: "Admin" })
    senderType!: string; // Admin or User

    @CreateDateColumn()
    createdAt!: Date;
}
