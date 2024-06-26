import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScormModule } from './scorm/scorm.module';
import { StaticScormModule } from './static_scorm/static_scorm.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';


@Module({
  imports: [ScormModule, StaticScormModule, ServeStaticModule.forRoot({
    serveRoot: '/files',
    rootPath: join(__dirname, '..', 'files'),
  }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
