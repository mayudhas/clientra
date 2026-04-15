import { Injectable, NotFoundException } from '@nestjs/common';
import { CoreService } from '../../common/services/core.service';
import { Task } from './entities/task.entity';
import { TasksRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ProjectsRepository } from './projects.repository';

@Injectable()
export class TasksService extends CoreService<Task> {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly projectsRepository: ProjectsRepository,
  ) {
    super(tasksRepository);
  }

  async createTask(createTaskDto: CreateTaskDto, projectId: string, tenantId: string | null): Promise<Task> {
    // Verify project exists and get its tenantId
    const project = await this.projectsRepository.findById(projectId);
    if (!project) {
      throw new NotFoundException(`Project with ID "${projectId}" not found`);
    }
    if (tenantId && project.tenantId !== tenantId) {
      throw new NotFoundException(`Project with ID "${projectId}" not found`);
    }

    // Use project's tenantId if user doesn't have one (Super Admin)
    const finalTenantId = tenantId || project.tenantId;

    const task = await super.create({
      ...createTaskDto,
      projectId,
      tenantId: finalTenantId,
    });

    await this.recalculateProjectProgress(projectId);
    return task;
  }

  async findAllByProject(projectId: string, tenantId: string | null): Promise<Task[]> {
    const where: any = { projectId };
    if (tenantId) {
      where.tenantId = tenantId;
    }

    return await this.tasksRepository.findAll({
      where,
      order: { createdAt: 'ASC' },
    });
  }

  async updateTask(taskId: string, updateTaskDto: UpdateTaskDto, tenantId: string | null): Promise<Task | null> {
    const task = await this.findTaskByTenant(taskId, tenantId);

    const updated = await super.update(taskId, updateTaskDto);

    // Recalculate project progress after status change
    await this.recalculateProjectProgress(task.projectId);

    return updated;
  }

  async removeTask(taskId: string, tenantId: string | null): Promise<void> {
    const task = await this.findTaskByTenant(taskId, tenantId);
    const projectId = task.projectId;

    await super.delete(taskId);

    // Recalculate project progress after task removal
    await this.recalculateProjectProgress(projectId);
  }

  // ─── Private Helpers ───────────────────────────────────────

  private async findTaskByTenant(taskId: string, tenantId: string | null): Promise<Task> {
    const where: any = { id: taskId };
    if (tenantId) {
      where.tenantId = tenantId;
    }

    const task = await this.tasksRepository.findAll({ where });
    if (!task || task.length === 0) {
      throw new NotFoundException(`Task with ID "${taskId}" not found`);
    }
    return task[0];
  }

  private async verifyProjectOwnership(projectId: string, tenantId: string | null): Promise<void> {
    const project = await this.projectsRepository.findById(projectId);
    if (!project) {
      throw new NotFoundException(`Project with ID "${projectId}" not found`);
    }
    if (tenantId && project.tenantId !== tenantId) {
      throw new NotFoundException(`Project with ID "${projectId}" not found`);
    }
  }

  /**
   * Recalculate project progress based on completed tasks.
   * Formula: (done tasks / total tasks) * 100
   */
  private async recalculateProjectProgress(projectId: string): Promise<void> {
    const tasks = await this.tasksRepository.findAll({
      where: { projectId } as any,
    });

    if (tasks.length === 0) {
      // No tasks — reset progress to 0
      await this.projectsRepository.update(projectId, { progress: 0 } as any);
      return;
    }

    const doneTasks = tasks.filter((t) => t.status === 'done').length;
    const progress = Math.round((doneTasks / tasks.length) * 100);

    await this.projectsRepository.update(projectId, { progress } as any);
  }
}
