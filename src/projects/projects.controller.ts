import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PublishOpenRelaisDto } from './dto/publish-open-relais.dto';
import { QueryPublicProjectsDto } from './dto/query-public-projects.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // ===== CRUD =====

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Post()
  create(
    @Body() dto: CreateProjectDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.projectsService.create(user.id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Get('mine')
  getUserProjects(@CurrentUser() user: { id: number }) {
    return this.projectsService.findByUser(user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.projectsService.update(id, user.id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.projectsService.remove(id, user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Patch(':id/archive')
  archive(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.projectsService.archive(id, user.id);
  }

  // ===== OPEN-RELAIS =====

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Patch(':id/publish')
  publishToOpenRelais(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PublishOpenRelaisDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.projectsService.publishToOpenRelais(id, user.id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Patch(':id/unpublish')
  unpublish(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.projectsService.unpublish(id, user.id);
  }

  @Get('public/discover')
  getPublicProjects(@Query() query: QueryPublicProjectsDto) {
    return this.projectsService.getPublicProjects(query);
  }

  @Get('public/:id')
  getPublicProjectDetails(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.getPublicProjectDetails(id);
  }

  // ===== REPRISE & FILIATION =====

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Post(':id/adopt')
  adoptProject(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.projectsService.adoptProject(id, user.id);
  }

  @Get(':id/lineage')
  getProjectLineage(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.getProjectLineage(id);
  }
}