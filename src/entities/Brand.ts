import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Brand {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ nullable: true })
    logo?: string;

    @Column({ nullable: true })
    website?: string;

    @Column({ default: "Active" })
    status!: string;
}
