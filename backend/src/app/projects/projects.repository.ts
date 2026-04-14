import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoreRepository } from '../../common/repositories/core.repository';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsRepository extends CoreRepository<Project> {
  constructor(
    @InjectRepository(Project)
    repository: Repository<Project>,
  ) {
    super(repository);
  }
}
