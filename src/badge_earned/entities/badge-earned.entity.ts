import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn,
    CreateDateColumn, Unique,
    Column, } from "typeorm";
import { Project } from "src/projects/entities/project.entity";
import { Badge } from "src/badges/entities/badge.entity";

@Entity('badges_earned')
@Unique(['project', 'badge'])
export class BadgeEarned {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Project, (project) => project.badgesEarned, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @ManyToOne(() => Badge, (badge) => badge.badgeEarned, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'badge_id' })
    badge: Badge;

    @Column({ name: 'badge_id' })
    badgeId: number;

    @CreateDateColumn({ name: 'earned_at' })
    earnedAt: Date;
}