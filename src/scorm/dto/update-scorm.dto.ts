import { PartialType } from '@nestjs/mapped-types';
import { CreateScormDto } from './create-scorm.dto';

export class UpdateScormDto extends PartialType(CreateScormDto) {}
