import { Module } from '@nestjs/common';
import { ScormController } from './scorm.controller';
import { ScormService } from './scorm.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scorm } from './entities/scorm.entity';

@Module({
  controllers: [ScormController],
  providers: [ScormService],
  imports: [
    TypeOrmModule.forFeature([Scorm])
  ],
})
export class ScormModule {}
