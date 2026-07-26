import { Module } from '@nestjs/common';
import { BadgeEarnedService } from './badge_earned.service';
import { BadgeEarnedController } from './badge_earned.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BadgeEarned } from './entities/badge-earned.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BadgeEarned])],
  controllers: [BadgeEarnedController],
  providers: [BadgeEarnedService],
  exports: [BadgeEarnedService]
})
export class BadgeEarnedModule {}
