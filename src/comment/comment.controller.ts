import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CommentsService } from './comment.service';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Post()
  @ApiOperation({ summary: 'Créer un nouveau commentaire' })
  @ApiResponse({ status: 201, description: 'Commentaire créé avec succès' })
  create(
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.commentsService.create(user.id, dto);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Récupérer tous les commentaires d\'un projet' })
  getProjectComments(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.commentsService.findByProject(projectId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Récupérer tous les commentaires d\'un utilisateur' })
  getUserComments(@Param('userId', ParseIntPipe) userId: number) {
    return this.commentsService.findByUser(userId);
  }

  @Get('my-comments')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Récupérer mes commentaires' })
  getMyComments(@CurrentUser() user: { id: number }) {
    return this.commentsService.findByUser(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un commentaire par son ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un commentaire' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCommentDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.commentsService.update(id, user.id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un commentaire' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.commentsService.remove(id, user.id);
  }

  @Get(':id/replies')
  @ApiOperation({ summary: 'Récupérer les réponses d\'un commentaire' })
  getReplies(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.getReplies(id);
  }
}