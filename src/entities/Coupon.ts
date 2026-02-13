import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Coupon {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    code!: string; // e.g. WELCOME50

    @Column()
    type!: string; // PERCENTAGE or FLAT

    @Column("decimal", { precision: 10, scale: 2 })
    value!: number; // e.g. 50 (if flat) or 20 (if percentage)

    @Column("decimal", { precision: 10, scale: 2, default: 0 })
    min_order_value!: number; // e.g. 200

    @Column("decimal", { precision: 10, scale: 2, nullable: true })
    max_discount!: number; // e.g. up to 100

    @Column({ nullable: true })
    expiryDate!: Date;

    @Column({ default: true })
    isActive!: boolean;

    @Column({ default: 0 })
    usageCount!: number;

    @CreateDateColumn()
    createdAt!: Date;
}
