import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BeforeInsert,
  OneToOne,
  OneToMany,
} from "typeorm";
import { Role } from "./Role";
import bcrypt from "bcryptjs";
import { Profile } from "./Profile";
import { UserLessonProgress } from "./UserLessonProgress";

@Entity()
export class Users {
  @PrimaryGeneratedColumn("uuid")
  userId!: string;

  @Column()
  fullName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @ManyToOne(() => Role, (role) => role.users)
  role!: Role;

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile!: Profile;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
  @OneToMany(() => UserLessonProgress, (progress) => progress.user)
  lessonProgress!: UserLessonProgress[];
}
