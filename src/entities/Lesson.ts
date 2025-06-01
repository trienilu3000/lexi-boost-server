import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Step } from "./Step";

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column("text")
  content?: string;

  @ManyToOne(() => Step, (step) => step.lessons, { onDelete: "CASCADE" })
  step!: Step;
}
