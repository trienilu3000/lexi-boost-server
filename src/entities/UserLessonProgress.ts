import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from "typeorm";
import { Users } from "./User";
import { Lesson } from "./Lesson";

@Entity()
@Unique(["user", "lesson"])
export class UserLessonProgress {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @ManyToOne(() => Users, (user) => user.lessonProgress, {
    onDelete: "CASCADE",
  })
  user!: Users;

  @ManyToOne(() => Lesson, { onDelete: "CASCADE" })
  lesson?: Lesson;

  @Column({ default: false })
  started!: boolean;

  @Column({ default: false })
  completed!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
