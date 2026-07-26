import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BadgeEarned } from 'src/badge_earned/entities/badge-earned.entity';

@Entity('badges')
export class Badge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => BadgeEarned, (badgeEarned) => badgeEarned.badge)
  badgeEarned: BadgeEarned[];
}