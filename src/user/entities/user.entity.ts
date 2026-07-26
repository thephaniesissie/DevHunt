import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Project } from "src/projects/entities/project.entity";
import { Notification } from "src/notification/entities/notification.entity";
import { GoalsProgress } from "src/goals-progress/entities/goals-progress.entity";
import { BadgeEarned } from "src/badge_earned/entities/badge-earned.entity";
import { Comment } from "src/comment/entities/comment.entity"; // Ajouter l'import

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
  projects!: Project[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications!: Notification[];

  @OneToMany(() => GoalsProgress, (progress) => progress.user)
  goalsProgress!: GoalsProgress[];

  @OneToMany(() => BadgeEarned, (badgeEarned) => badgeEarned.user)
  badgesEarned!: BadgeEarned[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments!: Comment[];
}