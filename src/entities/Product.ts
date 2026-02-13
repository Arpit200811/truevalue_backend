import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";
import { Category } from "./Category";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column("text", { nullable: true })
    description?: string;

    @Column({ default: 'General' })
    type!: string;

    @Column("decimal", { precision: 10, scale: 2, nullable: true })
    mrp?: number;

    @Column("decimal", { precision: 10, scale: 2 })
    price!: number;

    @Column({ default: 0 })
    stock!: number;

    @Column({ nullable: true })
    unit?: string;

    @Column({ default: true })
    is_veg!: boolean;

    @Column({ default: false })
    rx_required!: boolean;

    @Column({ nullable: true })
    expiry_date?: string;

    @Column({ nullable: true })
    preparation_time?: string;

    @Column({ nullable: true })
    sku?: string;

    @Column("jsonb", { nullable: true })
    variants?: any;

    @Column({ nullable: true })
    brand_id?: string;

    @Column({ nullable: true })
    image?: string;

    @Column({ default: true })
    isActive!: boolean;

    @ManyToOne(() => Category, (category) => category.products)
    category!: Category;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
