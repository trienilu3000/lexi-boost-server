import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Users } from "./User";

@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    bio?: string;

    @Column({ nullable: true })
    phone?: string;

    @Column({ nullable: true })
    address?: string;

    @Column({ nullable: true })
    birthday?: string;

    @Column({ nullable: true })
    avatarUrl?: string;

    @OneToOne(() => Users)
    @JoinColumn()
    user!: Users;
}
