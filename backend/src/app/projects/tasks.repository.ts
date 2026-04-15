import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoreRepository } from '../../common/repositories/core.repository';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksRepository extends CoreRepository<Task> {
  constructor(
    @InjectRepository(Task)
    repository: Repository<Task>,
  ) {
    super(repository);
  }
}
