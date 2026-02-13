import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn
} from "typeorm";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column("text")
    message!: string;

    @Column({ nullable: true })
    actionLink?: string;

    @Column({ default: "Global" })
    reach!: string;

    @Column({ default: "Sent" })
    status!: string;

    @CreateDateColumn()
    createdAt!: Date;
}
