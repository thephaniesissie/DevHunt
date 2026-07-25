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
import { ProjectStatus } from './enums/project-status.enum';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  create(userId: number, dto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepository.create({ ...dto, userId });
    return this.projectRepository.save(project);
  }

  findAll(): Promise<Project[]> {
    return this.projectRepository.find({ relations: { user: true } });
  }

  findPublic(): Promise<Project[]> {
    return this.projectRepository.find({
      where: { isPublic: true, status: ProjectStatus.ABANDONED },
      relations: { user: true },
    });
  }

  findByUser(userId: number): Promise<Project[]> {
    return this.projectRepository.find({ where: { userId } });
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: { user: true, parentProject: true },
    });
    if (!project) {
      throw new NotFoundException(`Projet #${id} introuvable.`);
    }
    return project;
  }

  async update(
    id: string,
    userId: number,
    dto: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.findOne(id);
    if (project.userId !== userId) {
      throw new ForbiddenException("Vous n'êtes pas propriétaire de ce projet.");
    }
    Object.assign(project, dto);
    return this.projectRepository.save(project);
  }

  async abandon(
    id: string,
    userId: number,
    makePublic: boolean,
    openRelaisDto?: PublishOpenRelaisDto,
  ): Promise<Project | void> {
    const project = await this.findOne(id);
    if (project.userId !== userId) {
      throw new ForbiddenException("Vous n'êtes pas propriétaire de ce projet.");
    }

    if (!makePublic) {
      await this.projectRepository.remove(project);
      return;
    }

    if (!openRelaisDto) {
      throw new BadRequestException(
        'Les champs de publication (description, lien, image) sont requis pour un Open-Relais.',
      );
    }

    project.status = ProjectStatus.ABANDONED;
    project.isPublic = true;
    project.publicDescription = openRelaisDto.publicDescription;
    project.projectLink = openRelaisDto.projectLink;
    project.coverImageUrl = openRelaisDto.coverImageUrl;
    project.docLink = openRelaisDto.docLink ?? null;

    return this.projectRepository.save(project);
  }

  async fork(parentId: string, userId: number): Promise<Project> {
    const parent = await this.findOne(parentId);
    if (!parent.isPublic) {
      throw new ForbiddenException("Ce projet n'est pas ouvert à la reprise.");
    }

    const forked = this.projectRepository.create({
      title: parent.title,
      description: parent.description,
      frequencyType: parent.frequencyType,
      frequencyTargetMinutes: parent.frequencyTargetMinutes,
      userId,
      parentProjectId: parent.id,
    });
    return this.projectRepository.save(forked);
  }

  async remove(id: string, userId: number): Promise<void> {
    const project = await this.findOne(id);
    if (project.userId !== userId) {
      throw new ForbiddenException("Vous n'êtes pas propriétaire de ce projet.");
    }
    await this.projectRepository.remove(project);
  }
}