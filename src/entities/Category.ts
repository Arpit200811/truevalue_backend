import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";
import { Product } from "./Product";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column({ nullable: true })
    image?: string;

    @ManyToOne(() => Category, (category) => category.children, { onDelete: 'CASCADE' })
    parent?: Category;

    @OneToMany(() => Category, (category) => category.parent)
    children!: Category[];

    @OneToMany(() => Product, (product) => product.category)
    products!: Product[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
