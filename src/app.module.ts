import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScormModule } from './scorm/scorm.module';
import { StaticScormModule } from './static_scorm/static_scorm.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { StudentModule } from './student/student.module';

@Module({
  imports: [ScormModule, StudentModule, StaticScormModule,
    ServeStaticModule.forRoot({
      serveRoot: '/files',
      rootPath: join(__dirname, '..', 'files'),
    }),
    ConfigModule.forRoot({
      isGlobal: true, // Opcional: hace que las variables de configuración estén disponibles en toda la aplicación sin necesidad de importar el módulo en otros módulos
    }),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
