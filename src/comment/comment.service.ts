import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userId: number, dto: CreateCommentDto): Promise<Comment> {
    const project = await this.projectRepository.findOne({
      where: { id: dto.projectId },
    });
    if (!project) {
      throw new NotFoundException(`Projet #${dto.projectId} introuvable`);
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`Utilisateur #${userId} introuvable`);
    }

    if (dto.parentCommentId) {
      const parentComment = await this.commentRepository.findOne({
        where: { id: dto.parentCommentId },
      });
      if (!parentComment) {
        throw new NotFoundException(`Commentaire parent #${dto.parentCommentId} introuvable`);
      }
      if (parentComment.projectId !== dto.projectId) {
        throw new BadRequestException('Le commentaire parent n\'appartient pas à ce projet');
      }
    }

    const comment = this.commentRepository.create({
      userId,
      projectId: dto.projectId,
      content: dto.content,
      parentCommentId: dto.parentCommentId || null,
      metadata: dto.metadata || null,
    });

    return this.commentRepository.save(comment);
  }

  async findOne(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: { user: true, project: true, parentComment: true },
    });
    if (!comment) {
      throw new NotFoundException(`Commentaire #${id} introuvable`);
    }
    return comment;
  }

  async findByProject(projectId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { 
        projectId, 
        parentCommentId: IsNull() // Utiliser IsNull() au lieu de null
      },
      relations: { user: true, replies: { user: true } },
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { userId },
      relations: { project: true, replies: true },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, userId: number, dto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.findOne(id);
    
    if (comment.userId !== userId) {
      throw new ForbiddenException('Vous n\'êtes pas l\'auteur de ce commentaire');
    }

    if (dto.projectId && dto.projectId !== comment.projectId) {
      const project = await this.projectRepository.findOne({
        where: { id: dto.projectId },
      });
      if (!project) {
        throw new NotFoundException(`Projet #${dto.projectId} introuvable`);
      }
      comment.projectId = dto.projectId;
    }

    Object.assign(comment, dto);
    return this.commentRepository.save(comment);
  }

  async remove(id: number, userId: number): Promise<void> {
    const comment = await this.findOne(id);
    if (comment.userId !== userId) {
      throw new ForbiddenException('Vous n\'êtes pas l\'auteur de ce commentaire');
    }
    await this.commentRepository.remove(comment);
  }

  // Ajouter la méthode getReplies manquante
  async getReplies(commentId: number): Promise<Comment[]> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });
    if (!comment) {
      throw new NotFoundException(`Commentaire #${commentId} introuvable`);
    }

    return this.commentRepository.find({
      where: { parentCommentId: commentId },
      relations: { user: true },
      order: { createdAt: 'ASC' },
    });
  }
}