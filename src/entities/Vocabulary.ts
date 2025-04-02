import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Vocabulary {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  word?: string;

  @Column()
  phonetic?: string;

  @Column()
  meaning?: string;

  @Column()
  audio?: string;

  @Column()
  learned?: boolean;
}
