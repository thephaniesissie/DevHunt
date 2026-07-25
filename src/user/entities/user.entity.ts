import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Project } from "src/projects/entities/project.entity";
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  pseudo!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string; // Stocké sous forme de hash bcrypt

  @OneToMany(() => Project, (project) => project.user)
  projects: Project[];
}