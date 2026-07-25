import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Badge } from './entities/badge.entity';
import { UpdateBadgeDto } from './dto/update-badge.dto';

@Injectable()
export class BadgesService {
  constructor(
    @InjectRepository(Badge)
    private readonly badgeRepository: Repository<Badge>,
  ) {}

  findAll(): Promise<Badge[]> {
    return this.badgeRepository.find();
  }

  async findOne(id: number): Promise<Badge> {
    const badge = await this.badgeRepository.findOne({ where: { id } });
    if (!badge) {
      throw new NotFoundException(`Badge #${id} introuvable.`);
    }
    return badge;
  }

  async update(id: number, updateBadgeDto: UpdateBadgeDto): Promise<Badge> {
    const badge = await this.findOne(id);
    Object.assign(badge, updateBadgeDto);
    return this.badgeRepository.save(badge);
  }
}