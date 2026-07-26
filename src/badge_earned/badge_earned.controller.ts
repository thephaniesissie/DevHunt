import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateBadgeEarnedDto } from './dto/create-badge-earned.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { BadgesEarnedService } from './badge_earned.service';

@ApiTags('badges-earned')
@Controller('badges-earned')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
export class BadgesEarnedController {
  constructor(private readonly badgesEarnedService: BadgesEarnedService) {}

  @Post()
  @ApiOperation({ summary: 'Attribuer un badge à un projet' })
  @ApiResponse({ status: 201, description: 'Badge attribué avec succès' })
  create(
    @Body() dto: CreateBadgeEarnedDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.badgesEarnedService.create(user.id, dto);
  }

  @Get('user')
  @ApiOperation({ summary: 'Récupérer tous les badges de l\'utilisateur connecté' })
  getUserBadges(@CurrentUser() user: { id: number }) {
    return this.badgesEarnedService.findByUser(user.id);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Récupérer tous les badges d\'un projet' })
  getProjectBadges(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.badgesEarnedService.findByProject(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un badge attribué par son ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.badgesEarnedService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Retirer un badge attribué' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.badgesEarnedService.remove(id, user.id);
  }
}