import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { ClientsRepository } from './clients.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  controllers: [ClientsController],
  providers: [ClientsService, ClientsRepository],
  exports: [ClientsService, ClientsRepository],
})
export class ClientsModule {}
