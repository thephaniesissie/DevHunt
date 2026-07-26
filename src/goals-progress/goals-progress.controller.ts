import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GoalsProgressService } from './goals-progress.service';
import { CreateGoalsProgressDto } from './dto/create-goals-progress.dto';
import { UpdateGoalsProgressDto } from './dto/update-goals-progress.dto';
import { QueryGoalsProgressDto } from './dto/query-goals-progress.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('goals-progress')
@Controller('goals-progress')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
export class GoalsProgressController {
  constructor(private readonly goalsProgressService: GoalsProgressService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle session de progression' })
  @ApiResponse({ status: 201, description: 'Session créée avec succès' })
  create(
    @Body() dto: CreateGoalsProgressDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.goalsProgressService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les sessions avec filtres' })
  findAll(@Query() query: QueryGoalsProgressDto) {
    return this.goalsProgressService.findAll(query);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Récupérer toutes les sessions d\'un projet' })
  findByProject(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.goalsProgressService.findByProject(projectId);
  }

  @Get('my-sessions')
  @ApiOperation({ summary: 'Récupérer mes sessions de progression' })
  getMySessions(@CurrentUser() user: { id: number }) {
    return this.goalsProgressService.findByUser(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une session par son ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.goalsProgressService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une session' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGoalsProgressDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.goalsProgressService.update(id, user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une session' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.goalsProgressService.remove(id, user.id);
  }

  @Patch(':id/validate')
  @ApiOperation({ summary: 'Valider une session' })
  validate(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.goalsProgressService.validateSession(id, user.id); // Corrigé: validateSession au lieu de validateS
  }

  @Get('stats/:projectId')
  @ApiOperation({ summary: 'Statistiques de progression d\'un projet' })
  getProjectStats(
    @Param('projectId', ParseIntPipe) projectId: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.goalsProgressService.getProjectStats(projectId, user.id);
  }
}