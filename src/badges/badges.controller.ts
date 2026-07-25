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

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBadgeDto: UpdateBadgeDto,
  ) {
    return this.badgesService.update(id, updateBadgeDto);
  }
}