import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadgeEarned } from './entities/badge-earned.entity';
import { CreateBadgeEarnedDto } from './dto/create-badge-earned.dto';
import { Project } from 'src/projects/entities/project.entity';
import { Badge } from 'src/badges/entities/badge.entity';

@Injectable()
export class BadgesEarnedService {
  constructor(
    @InjectRepository(BadgeEarned)
    private readonly badgeEarnedRepository: Repository<BadgeEarned>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Badge)
    private readonly badgeRepository: Repository<Badge>,
  ) {}

  async create(userId: number, dto: CreateBadgeEarnedDto): Promise<BadgeEarned> {
    // Vérifier que le projet existe
    const project = await this.projectRepository.findOne({
      where: { id: dto.projectId },
    });
    if (!project) {
      throw new NotFoundException(`Projet #${dto.projectId} introuvable`);
    }

    // Vérifier les droits
    if (project.userId !== userId) {
      throw new ForbiddenException('Vous n\'êtes pas propriétaire de ce projet');
    }

    // Vérifier que le badge existe
    const badge = await this.badgeRepository.findOne({
      where: { id: dto.badgeId },
    });
    if (!badge) {
      throw new NotFoundException(`Badge #${dto.badgeId} introuvable`);
    }

    // Vérifier que le badge n'est pas déjà attribué pour ce projet
    const existing = await this.badgeEarnedRepository.findOne({
      where: {
        badgeId: dto.badgeId,
        projectId: dto.projectId,
      },
    });
    if (existing) {
      throw new BadRequestException('Ce badge a déjà été attribué à ce projet');
    }

    const badgeEarned = this.badgeEarnedRepository.create({
      userId,
      badgeId: dto.badgeId,
      projectId: dto.projectId,
      achievementContext: dto.achievementContext || null,
      metadata: dto.metadata || null,
    });

    return this.badgeEarnedRepository.save(badgeEarned);
  }

  async findOne(id: number): Promise<BadgeEarned> {
    const badgeEarned = await this.badgeEarnedRepository.findOne({
      where: { id },
      relations: { user: true, badge: true, project: true },
    });
    if (!badgeEarned) {
      throw new NotFoundException(`Badge attribué #${id} introuvable`);
    }
    return badgeEarned;
  }

  async findByUser(userId: number): Promise<BadgeEarned[]> {
    return this.badgeEarnedRepository.find({
      where: { userId },
      relations: { badge: true, project: true },
      order: { earnedAt: 'DESC' },
    });
  }

  async findByProject(projectId: number): Promise<BadgeEarned[]> {
    return this.badgeEarnedRepository.find({
      where: { projectId },
      relations: { badge: true, user: true },
      order: { earnedAt: 'DESC' },
    });
  }

  async remove(id: number, userId: number): Promise<void> {
    const badgeEarned = await this.findOne(id);
    
    // Vérifier les droits
    const project = await this.projectRepository.findOne({
      where: { id: badgeEarned.projectId },
    });
    if (!project || project.userId !== userId) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à retirer ce badge');
    }

    await this.badgeEarnedRepository.remove(badgeEarned);
  }
}