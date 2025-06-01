import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Gate } from "./Gate";
import { Lesson } from "./Lesson";

@Entity()
export class Step {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name?: string;

  @ManyToOne(() => Gate, (gate) => gate.steps, { onDelete: "CASCADE" })
  gate!: Gate;

  @OneToMany(() => Lesson, (lesson) => lesson.step)
  lessons!: Lesson[];
}
