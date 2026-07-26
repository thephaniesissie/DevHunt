import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoalsProgressController } from './goals-progress.controller';
import { GoalsProgressService } from './goals-progress.service';
import { GoalsProgress } from './entities/goals-progress.entity';
import { Project } from 'src/projects/entities/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GoalsProgress, Project])],
  controllers: [GoalsProgressController],
  providers: [GoalsProgressService],
  exports: [GoalsProgressService],
})
export class GoalsProgressModule {}