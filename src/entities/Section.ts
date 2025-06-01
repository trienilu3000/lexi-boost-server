import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Gate } from "./Gate";

@Entity()
export class Section {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @OneToMany(() => Gate, (gate) => gate.section)
  gates!: Gate[];
}
