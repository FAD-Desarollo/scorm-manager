import { Module } from '@nestjs/common';
import { StaticScormController } from './static_scorm.controller';

@Module({
  controllers: [StaticScormController],
  providers: [],
})
export class StaticScormModule {}
