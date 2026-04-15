import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UserRole } from '../../common/enums/user-role.enum';

@Controller('projects/:projectId/tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(
    @Param('projectId') projectId: string,
    @Body() createTaskDto: CreateTaskDto,
    @Request() req,
  ) {
    const isSuperAdmin = req.user.role === UserRole.SUPER_ADMIN;
    const tenantId = req.user.tenantId;

    if (!isSuperAdmin && !tenantId) {
      throw new BadRequestException('Action denied: You must be associated with a tenant.');
    }

    return this.tasksService.createTask(createTaskDto, projectId, tenantId);
  }

  @Get()
  findAll(@Param('projectId') projectId: string, @Request() req) {
    const isSuperAdmin = req.user.role === UserRole.SUPER_ADMIN;
    const tenantId = isSuperAdmin ? null : req.user.tenantId;
    return this.tasksService.findAllByProject(projectId, tenantId);
  }

  @Patch(':taskId')
  update(
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req,
  ) {
    const isSuperAdmin = req.user.role === UserRole.SUPER_ADMIN;
    const tenantId = isSuperAdmin ? null : req.user.tenantId;

    if (!isSuperAdmin && !tenantId) {
      throw new BadRequestException('Action denied: You must be associated with a tenant.');
    }

    return this.tasksService.updateTask(taskId, updateTaskDto, tenantId);
  }

  @Delete(':taskId')
  remove(@Param('taskId') taskId: string, @Request() req) {
    const isSuperAdmin = req.user.role === UserRole.SUPER_ADMIN;
    const tenantId = isSuperAdmin ? null : req.user.tenantId;

    if (!isSuperAdmin && !tenantId) {
      throw new BadRequestException('Action denied: You must be associated with a tenant.');
    }

    return this.tasksService.removeTask(taskId, tenantId);
  }
}
