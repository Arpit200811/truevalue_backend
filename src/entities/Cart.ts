import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { Product } from "./Product";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User)
    user!: User;

    @Column({ default: "active" })
    status!: string; // active, abandoned, converted

    @OneToMany(() => CartItem, (item) => item.cart, { cascade: true })
    items!: CartItem[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}

@Entity()
export class CartItem {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Cart, (cart) => cart.items)
    cart!: Cart;

    @ManyToOne(() => Product)
    product!: Product;

    @Column()
    quantity!: number;

    @Column("decimal", { precision: 10, scale: 2 })
    priceAtTime!: number;
}
