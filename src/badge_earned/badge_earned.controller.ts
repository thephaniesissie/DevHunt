import { Controller } from '@nestjs/common';
import { BadgeEarnedService } from './badge_earned.service';

@Controller('badge-earned')
export class BadgeEarnedController {
  constructor(private readonly badgeEarnedService: BadgeEarnedService) {}
}
