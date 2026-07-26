import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { GoalsProgress } from './entities/goals-progress.entity';
import { CreateGoalsProgressDto } from './dto/create-goals-progress.dto';
import { UpdateGoalsProgressDto } from './dto/update-goals-progress.dto';
import { QueryGoalsProgressDto } from './dto/query-goals-progress.dto';
import { Project } from 'src/projects/entities/project.entity';

@Injectable()
export class GoalsProgressService {
  constructor(
    @InjectRepository(GoalsProgress)
    private readonly goalsProgressRepository: Repository<GoalsProgress>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(userId: number, dto: CreateGoalsProgressDto): Promise<GoalsProgress> {
    // Vérifier que le projet existe
    const project = await this.projectRepository.findOne({
      where: { id: dto.projectId },
    });
    if (!project) {
      throw new NotFoundException(`Projet #${dto.projectId} introuvable`);
    }

    // Vérifier que l'utilisateur est propriétaire du projet
    if (project.userId !== userId) {
      throw new ForbiddenException('Vous n\'êtes pas propriétaire de ce projet');
    }

    const progress = this.goalsProgressRepository.create({
      projectId: dto.projectId,
      userId,
      minutesSpent: dto.minutesSpent,
      note: dto.note || null,
      isValidated: dto.isValidated || false,
      metadata: dto.metadata || null,
    });

    return this.goalsProgressRepository.save(progress);
  }

  async findAll(query: QueryGoalsProgressDto): Promise<{ data: GoalsProgress[]; total: number; page: number; limit: number }> {
    const { projectId, userId, isValidated, startDate, endDate, page = 1, limit = 10 } = query;

    const qb = this.goalsProgressRepository
      .createQueryBuilder('progress')
      .leftJoinAndSelect('progress.project', 'project')
      .leftJoinAndSelect('progress.user', 'user');

    if (projectId) {
      qb.andWhere('progress.projectId = :projectId', { projectId });
    }

    if (userId) {
      qb.andWhere('progress.userId = :userId', { userId });
    }

    if (isValidated !== undefined) {
      qb.andWhere('progress.isValidated = :isValidated', { isValidated });
    }

    if (startDate) {
      qb.andWhere('progress.createdAt >= :startDate', { startDate: new Date(startDate) });
    }

    if (endDate) {
      qb.andWhere('progress.createdAt <= :endDate', { endDate: new Date(endDate) });
    }

    qb.orderBy('progress.createdAt', 'DESC');
    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<GoalsProgress> {
    const progress = await this.goalsProgressRepository.findOne({
      where: { id },
      relations: { project: true, user: true },
    });
    if (!progress) {
      throw new NotFoundException(`Session #${id} introuvable`);
    }
    return progress;
  }

  async findByProject(projectId: number): Promise<GoalsProgress[]> {
    return this.goalsProgressRepository.find({
      where: { projectId },
      order: { createdAt: 'DESC' },
      relations: { user: true },
    });
  }

  async findByUser(userId: number): Promise<GoalsProgress[]> {
    return this.goalsProgressRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      relations: { project: true },
    });
  }

  async update(id: number, userId: number, dto: UpdateGoalsProgressDto): Promise<GoalsProgress> {
    const progress = await this.findOne(id);
    
    // Vérifier que l'utilisateur est propriétaire
    if (progress.userId !== userId) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à modifier cette session');
    }

    // Si on change le projet, vérifier les droits
    if (dto.projectId && dto.projectId !== progress.projectId) {
      const project = await this.projectRepository.findOne({
        where: { id: dto.projectId },
      });
      if (!project) {
        throw new NotFoundException(`Projet #${dto.projectId} introuvable`);
      }
      if (project.userId !== userId) {
        throw new ForbiddenException('Vous n\'êtes pas propriétaire de ce projet');
      }
      progress.projectId = dto.projectId;
    }

    Object.assign(progress, dto);
    return this.goalsProgressRepository.save(progress);
  }

  async remove(id: number, userId: number): Promise<void> {
    const progress = await this.findOne(id);
    if (progress.userId !== userId) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à supprimer cette session');
    }
    await this.goalsProgressRepository.remove(progress);
  }

  async validateSession(id: number, userId: number): Promise<GoalsProgress> {
    const progress = await this.findOne(id);
    if (progress.userId !== userId) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à valider cette session');
    }
    progress.isValidated = true;
    return this.goalsProgressRepository.save(progress);
  }

  async getProjectStats(projectId: number, userId: number): Promise<any> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException(`Projet #${projectId} introuvable`);
    }
    if (project.userId !== userId) {
      throw new ForbiddenException('Vous n\'êtes pas propriétaire de ce projet');
    }

    const sessions = await this.goalsProgressRepository.find({
      where: { projectId, userId },
    });

    const totalMinutes = sessions.reduce((sum, s) => sum + s.minutesSpent, 0);
    const validatedSessions = sessions.filter(s => s.isValidated);
    const totalValidatedMinutes = validatedSessions.reduce((sum, s) => sum + s.minutesSpent, 0);

    return {
      projectId,
      totalSessions: sessions.length,
      totalMinutes,
      validatedSessions: validatedSessions.length,
      totalValidatedMinutes,
      averageMinutesPerSession: sessions.length > 0 ? totalMinutes / sessions.length : 0,
      sessions,
    };
  }
}