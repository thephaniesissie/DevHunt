// src/notification/entities/notification.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @ManyToOne(() => User, { eager: true }) user!: User;
  @Column() title!: string;
  @Column() message!: string;
  @Column({ default: false }) isRead!: boolean;
  @CreateDateColumn() createdAt!: Date;
}