import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Task } from './entities/task.entity';
import { ProjectsController } from './projects.controller';
import { TasksController } from './tasks.controller';
import { ProjectsService } from './projects.service';
import { TasksService } from './tasks.service';
import { ProjectsRepository } from './projects.repository';
import { TasksRepository } from './tasks.repository';
import { ClientsModule } from '../clients/clients.module';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Task]), ClientsModule],
  controllers: [ProjectsController, TasksController],
  providers: [ProjectsService, TasksService, ProjectsRepository, TasksRepository],
  exports: [ProjectsService, ProjectsRepository, TasksService],
})
export class ProjectsModule {}
