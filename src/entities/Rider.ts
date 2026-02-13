import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Rider {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column()
    email!: string;

    @Column()
    phone!: string;

    @Column({ default: "Active" }) // Active, Inactive, Banned
    status!: string;

    @Column({ default: "Offline" }) // Online, Offline, Busy
    availability!: string;

    @Column({ nullable: true })
    current_order_id?: string;

    @Column("decimal", { precision: 10, scale: 2, default: 0 })
    wallet_balance!: number;

    @Column("float", { default: 0 })
    rating!: number;

    @Column({ default: 0 })
    total_deliveries!: number;

    @Column({ nullable: true })
    vehicle_number?: string;

    @Column({ nullable: true })
    license_number?: string;

    @CreateDateColumn()
    joinedAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
