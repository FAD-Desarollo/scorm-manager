import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: process.env.DATABASE_HOST || 'db',
        port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
        username: process.env.DATABASE_USER || 'postgres',
        password: process.env.DATABASE_PASSWORD || 'postgres',
        database: process.env.DATABASE_NAME || 'postgres',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        autoLoadEntities: true,
        retryAttempts: 10,
        retryDelay: 3000,
      }),
    }),
  ],
})
export class DatabaseModule { }