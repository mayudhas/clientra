import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './app/auth/auth.module';
import { TenantsModule } from './app/tenants/tenants.module';
import { ClientsModule } from './app/clients/clients.module';
import { ProjectsModule } from './app/projects/projects.module';
import { InvoicesModule } from './app/invoices/invoices.module';
import { UsersModule } from './app/users/users.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_NAME', 'clientra'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    TenantsModule,
    ClientsModule,
    ProjectsModule,
    InvoicesModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
