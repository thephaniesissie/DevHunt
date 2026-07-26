import { PartialType } from '@nestjs/swagger';
import { CreateGoalsProgressDto } from './create-goals-progress.dto';

export class UpdateGoalsProgressDto extends PartialType(CreateGoalsProgressDto) {}
