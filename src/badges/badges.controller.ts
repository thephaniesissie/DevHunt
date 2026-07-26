import { Controller, Get, Patch, Param, Body, ParseIntPipe } from '@nestjs/common';
import { BadgesService } from './badges.service';
import { UpdateBadgeDto } from './dto/update-badge.dto';

@Controller('badges')
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Get()
  findAll() {
    return this.badgesService.findAll();
  }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.badgesService.findOne(id);
  }
}