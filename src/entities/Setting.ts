import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Setting {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    storeName!: string;

    @Column()
    supportEmail!: string;

    @Column()
    address!: string;

    @Column()
    currency!: string;

    @Column({ default: false })
    maintenance!: boolean;

    @Column({ default: true })
    cod!: boolean;

    @Column({ default: true })
    wallet!: boolean;

    @Column("decimal", { precision: 10, scale: 2, default: 0 })
    delivery_charge!: number;

    @Column("decimal", { precision: 10, scale: 2, default: 0 })
    min_order_value!: number;
}
