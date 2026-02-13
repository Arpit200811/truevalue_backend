import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Offer {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column()
    description!: string;

    @Column()
    code!: string;

    @Column("decimal", { precision: 10, scale: 2 })
    discount!: number;

    @Column({ default: "percentage" })
    type!: string;

    @Column({ default: true })
    isActive!: boolean;

    @Column({ nullable: true })
    expiryDate?: string;
}
