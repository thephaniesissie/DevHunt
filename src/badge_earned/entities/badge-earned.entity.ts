import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/user/entities/user.entity';
import { Badge } from 'src/badges/entities/badge.entity';

@Entity('badges_earned')
export class BadgeEarned {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.badgesEarned, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'user_id' })
  userId!: number;

  @ManyToOne(() => Badge, (badge) => badge.badgeEarned, { // Changé: badgeEarned au lieu de badgesEarned
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'badge_id' })
  badge!: Badge;

  @Column({ name: 'badge_id' })
  badgeId!: number;

  @ManyToOne(() => Project, (project) => project.badgesEarned, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project!: Project;

  @Column({ name: 'project_id' })
  projectId!: number;

  @Column({ type: 'text', nullable: true, name: 'achievement_context' })
  achievementContext!: string | null;

  @Column({ type: 'jsonb', nullable: true, name: 'metadata' })
  metadata!: Record<string, any> | null;

  @CreateDateColumn({ name: 'earned_at', type: 'timestamptz' })
  earnedAt!: Date;
}