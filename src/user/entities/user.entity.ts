import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications!: Notification[];
}