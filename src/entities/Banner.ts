import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Banner {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    imageUrl!: string;

    @Column({ nullable: true })
    link?: string;

    @Column({ default: "Main Home" })
    position!: string;

    @Column({ default: true })
    isActive!: boolean;
}
