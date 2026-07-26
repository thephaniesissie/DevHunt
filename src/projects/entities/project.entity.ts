import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  Check,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { FrequencyType } from '../enums/frequency-type.enum';
import { ProjectStatus } from '../enums/project-status.enum';
import { BadgeEarned } from 'src/badge_earned/entities/badge-earned.entity';
@Entity('projects')
@Check(
  `("is_public" = FALSE) OR (
    "public_description" IS NOT NULL AND
    "project_link" IS NOT NULL AND
    "cover_image_url" IS NOT NULL
  )`,
)
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.projects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;
  
  @Column({ type: 'text', nullable: true, name: 'type_projects' })
  typeProjects: string | null;

  // --- Champs Open-Relais (V3.0) ---
  @Column({ type: 'boolean', default: false, name: 'is_public' })
  isPublic: boolean;

  @Column({ type: 'text', nullable: true, name: 'public_description' })
  publicDescription: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'project_link' })
  projectLink: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'doc_link' })
  docLink: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'cover_image_url' })
  coverImageUrl: string | null;
  // --- Fin champs Open-Relais ---

  @ManyToOne(() => Project, (project) => project.children, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'parent_project_id' })
  parentProject: Project | null;

  @Column({ name: 'parent_project_id', nullable: true })
  parentProjectId: number | null;

  @OneToMany(() => Project, (project) => project.parentProject)
  children: Project[];

  @Column({ type: 'enum', enum: FrequencyType, name: 'frequency_type' })
  frequencyType: FrequencyType;

  @Column({ type: 'int', name: 'frequency_target_minutes' })
  frequencyTargetMinutes: number;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.ACTIVE,
  })
  status: ProjectStatus;

  @Column({ type: 'int', default: 0, name: 'current_streak' })
  currentStreak: number;

  @Column({ type: 'int', default: 0, name: 'best_streak' })
  bestStreak: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @OneToMany(() => BadgeEarned, (badgeEarned) => badgeEarned.project)
  badgesEarned: BadgeEarned[];
}