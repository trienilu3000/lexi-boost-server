import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class RevokedToken {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    token!: string;

    @CreateDateColumn()
    revokedAt!: Date;
}
