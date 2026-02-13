import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";
import { User } from "./User";
import { OrderItem } from "./OrderItem";

export enum OrderStatus {
    PENDING = "Pending",
    SHIPPED = "Shipped",
    DELIVERED = "Delivered",
    CANCELLED = "Cancelled"
}

@Entity()
export class Order {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => User)
    user!: User;

    @Column("decimal", { precision: 10, scale: 2 })
    total!: number;

    @Column({
        type: "enum",
        enum: OrderStatus,
        default: OrderStatus.PENDING
    })
    status!: OrderStatus;

    @Column({ nullable: true })
    paymentMethod?: string;

    @Column({ nullable: true })
    address?: string;

    @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
    items!: OrderItem[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
