import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class DeliveryZone {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string; // e.g. "South Delhi - Zone A"

    @Column("decimal", { precision: 10, scale: 2, default: 0 })
    base_fee!: number;

    @Column("decimal", { precision: 10, scale: 6 })
    latitude!: number;

    @Column("decimal", { precision: 10, scale: 6 })
    longitude!: number;

    @Column("int", { default: 5 })
    radius_km!: number; // Delivery radius in KM

    @Column({ default: false })
    surge_price_active!: boolean; // High Demand Mode

    @Column("decimal", { precision: 4, scale: 2, default: 1.0 })
    surge_multiplier!: number; // e.g. 1.5x price

    @CreateDateColumn()
    createdAt!: Date;
}
