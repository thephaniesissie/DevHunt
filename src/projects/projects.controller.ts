import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PublishOpenRelaisDto } from './dto/publish-open-relais.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Post()
  create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.projectsService.create(user.id, createProjectDto);
  }

  @Get()
  findAll(@Query('public') isPublic?: string) {
    if (isPublic === 'true') {
      return this.projectsService.findPublic();
    }
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.projectsService.update(id, user.id, updateProjectDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Patch(':id/abandon')
  abandon(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('makePublic') makePublic: boolean,
    @Body('openRelais') openRelais: PublishOpenRelaisDto | undefined,
    @CurrentUser() user: { id: number },
  ) {
    return this.projectsService.abandon(id, user.id, makePublic, openRelais);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Post(':id/fork')
  fork(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { id: number },
  ) {
    return this.projectsService.fork(id, user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { id: number },
  ) {
    return this.projectsService.remove(id, user.id);
  }
}