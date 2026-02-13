import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn
} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ unique: true })
    email!: string;

    @Column({ select: false })
    password!: string;

    @Column({ nullable: true })
    avatar?: string;

    @Column({ default: 'admin' })
    role!: string;

    @Column({ nullable: true })
    phone?: string;

    @Column({ default: 'Active' })
    status!: string;

    @Column({ type: 'int', default: 0 })
    orders!: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    spent!: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    wallet_balance!: number;

    @CreateDateColumn()
    createdAt!: Date;
}
