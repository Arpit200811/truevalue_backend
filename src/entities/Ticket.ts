import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";
import { TicketReply } from "./TicketReply";

export enum TicketStatus {
    OPEN = "Open",
    IN_PROGRESS = "In Progress",
    RESOLVED = "Resolved",
    CRITICAL = "Critical"
}

@Entity()
export class Ticket {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    user!: string;

    @Column()
    subject!: string;

    @Column("text")
    message!: string;

    @Column()
    category!: string;

    @Column({ default: "Medium" })
    priority!: string;

    @Column({
        type: "enum",
        enum: TicketStatus,
        default: TicketStatus.OPEN
    })
    status!: TicketStatus;

    @OneToMany(() => TicketReply, (reply) => reply.ticket)
    replies!: TicketReply[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
