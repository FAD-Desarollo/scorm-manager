import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScormModule } from './scorm/scorm.module';
import { StaticScormModule } from './static_scorm/static_scorm.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ScormModule, StaticScormModule,
    ServeStaticModule.forRoot({
      serveRoot: '/files',
      rootPath: join(__dirname, '..', 'files'),
    }),
    ConfigModule.forRoot({
      isGlobal: true, // Opcional: hace que las variables de configuración estén disponibles en toda la aplicación sin necesidad de importar el módulo en otros módulos
    }),
    DatabaseModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
