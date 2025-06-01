import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Section } from "./Section";
import { Step } from "./Step";

@Entity()
export class Gate {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name?: string;

  @ManyToOne(() => Section, (section) => section.gates, { onDelete: "CASCADE" })
  section!: Section;

  @OneToMany(() => Step, (step) => step.gate)
  steps!: Step[];
}
