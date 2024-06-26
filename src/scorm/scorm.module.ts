import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ScormController } from './scorm.controller';
import { ScormService } from './scorm.service';
import { diskStorage } from 'multer';
import { join } from 'path';

@Module({
  controllers: [ScormController],
  providers: [ScormService],
  imports: [
    // MulterModule.register({
    //   storage: diskStorage({
    //     destination: join(__dirname, '..', '..', 'uploads'), // Ruta relativa al directorio raíz
    //     filename: (req, file, cb) => {
    //       const filename = `${Date.now()}-${file.originalname}`;
    //       cb(null, filename);
    //     },
    //   }),
    // }),
  ],
})
export class ScormModule {}
