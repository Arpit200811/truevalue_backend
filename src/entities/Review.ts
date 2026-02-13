import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    user!: string;

    @Column()
    product!: string;

    @Column("int")
    rating!: number;

    @Column("text")
    comment!: string;

    @Column({ default: "Pending" })
    status!: string;

    @CreateDateColumn()
    createdAt!: Date;
}
