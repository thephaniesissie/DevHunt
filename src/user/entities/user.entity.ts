import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Project } from "src/projects/entities/project.entity";
import { Notification } from "src/notification/entities/notification.entity";
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

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications!: Notification[];
}