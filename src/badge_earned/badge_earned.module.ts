import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BadgeEarned } from './entities/badge-earned.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Badge } from 'src/badges/entities/badge.entity';
import { BadgesEarnedController } from './badge_earned.controller';
import { BadgesEarnedService } from './badge_earned.service';

@Module({
  imports: [TypeOrmModule.forFeature([BadgeEarned, Project, Badge])],
  controllers: [BadgesEarnedController],
  providers: [BadgesEarnedService],
  exports: [BadgesEarnedService],
})
export class BadgesEarnedModule {} // Le nom de la classe doit correspondre à l'export