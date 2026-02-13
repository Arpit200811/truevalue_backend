import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class WalletTransaction {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "decimal", precision: 12, scale: 2 })
    amount!: number;

    @Column()
    type!: string; // CREDIT / DEBIT

    @Column("text", { nullable: true })
    reason?: string;

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    user!: User;

    @CreateDateColumn()
    createdAt!: Date;
}
