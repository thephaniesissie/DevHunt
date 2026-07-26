import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PublishOpenRelaisDto } from './dto/publish-open-relais.dto';
import { QueryPublicProjectsDto } from './dto/query-public-projects.dto';
import { ProjectStatus } from './enums/project-status.enum';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  // ============ 1. CRUD DE BASE ============

  create(userId: number, dto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepository.create({ ...dto, userId });
    return this.projectRepository.save(project);
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: { user: true, parentProject: true },
    });
    if (!project) {
      throw new NotFoundException(`Projet #${id} introuvable.`);
    }
    return project;
  }

  findByUser(userId: number): Promise<Project[]> {
    // Tous statuts confondus : actifs, suspendus, abandonnés
    return this.projectRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    id: number,
    userId: number,
    dto: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.findOne(id);
    this.assertOwnership(project, userId);
    Object.assign(project, dto);
    return this.projectRepository.save(project);
  }

  // Suppression définitive
  async remove(id: number, userId: number): Promise<void> {
    const project = await this.findOne(id);
    this.assertOwnership(project, userId);
    await this.projectRepository.remove(project);
  }

  // Archivage doux (status: abandoned, mais reste privé)
  async archive(id: number, userId: number): Promise<Project> {
    const project = await this.findOne(id);
    this.assertOwnership(project, userId);
    project.status = ProjectStatus.ABANDONED;
    return this.projectRepository.save(project);
  }

  // ============ 2. OPEN-RELAIS (PUBLICATION & DÉCOUVERTE) ============

  async publishToOpenRelais(
    id: number,
    userId: number,
    dto: PublishOpenRelaisDto,
  ): Promise<Project> {
    const project = await this.findOne(id);
    this.assertOwnership(project, userId);

    if (!dto.publicDescription || !dto.projectLink || !dto.coverImageUrl) {
      throw new BadRequestException(
        'publicDescription, projectLink et coverImageUrl sont requis pour publier en Open-Relais.',
      );
    }

    project.status = ProjectStatus.ABANDONED;
    project.isPublic = true;
    project.publicDescription = dto.publicDescription;
    project.projectLink = dto.projectLink;
    project.coverImageUrl = dto.coverImageUrl;
    project.docLink = dto.docLink ?? null;

    return this.projectRepository.save(project);
  }

  async unpublish(id: number, userId: number): Promise<Project> {
    const project = await this.findOne(id);
    this.assertOwnership(project, userId);
    project.isPublic = false;
    return this.projectRepository.save(project);
  }

  async getPublicProjects(
    query: QueryPublicProjectsDto,
  ): Promise<{ data: Project[]; total: number; page: number; limit: number }> {
    const { search, sortBy = 'recent', page = 1, limit = 10 } = query;

    const qb = this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.user', 'user')
      .where('project.isPublic = :isPublic', { isPublic: true });

    if (search) {
      qb.andWhere(
        '(project.title ILIKE :search OR project.publicDescription ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (sortBy === 'popular') {
      qb.orderBy('project.bestStreak', 'DESC'); // proxy en attendant un vrai compteur
    } else {
      qb.orderBy('project.createdAt', 'DESC');
    }

    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async getPublicProjectDetails(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id, isPublic: true },
      relations: { user: true, parentProject: true, children: true },
    });
    if (!project) {
      throw new NotFoundException(
        `Projet public #${id} introuvable ou non publié.`,
      );
    }
    return project;
  }

  // ============ 3. REPRISE & FILIATION ============

  async adoptProject(originalProjectId: number, newUserId: number): Promise<Project> {
    const parent = await this.findOne(originalProjectId);
    if (!parent.isPublic) {
      throw new ForbiddenException("Ce projet n'est pas ouvert à la reprise.");
    }

    const adopted = this.projectRepository.create({
      title: parent.title,
      description: parent.description,
      frequencyType: parent.frequencyType,
      frequencyTargetMinutes: parent.frequencyTargetMinutes,
      userId: newUserId,
      parentProjectId: parent.id,
    });
    return this.projectRepository.save(adopted);
  }

  async getProjectLineage(id: number): Promise<{
    current: Project;
    parent: Project | null;
    children: Project[];
  }> {
    const current = await this.projectRepository.findOne({
      where: { id },
      relations: { parentProject: true, children: { user: true } },
    });
    if (!current) {
      throw new NotFoundException(`Projet #${id} introuvable.`);
    }

    return {
      current,
      parent: current.parentProject ?? null,
      children: current.children ?? [],
    };
  }

  // ============ Helper interne ============

  private assertOwnership(project: Project, userId: number): void {
    if (project.userId !== userId) {
      throw new ForbiddenException("Vous n'êtes pas propriétaire de ce projet.");
    }
  }
}