import { Injectable, NotFoundException } from '@nestjs/common';
import { CoreService } from '../../common/services/core.service';
import { Project } from './entities/project.entity';
import { ProjectsRepository } from './projects.repository';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService extends CoreService<Project> {
  constructor(protected readonly projectsRepository: ProjectsRepository) {
    super(projectsRepository);
  }

  async createProject(createProjectDto: CreateProjectDto, tenantId: string): Promise<Project> {
    return await super.create({
      ...createProjectDto,
      tenantId,
    });
  }

  async findAllByTenant(tenantId: string | null): Promise<Project[]> {
    const findOptions: any = {
      order: { createdAt: 'DESC' },
      relations: ['client'],
    };

    if (tenantId) {
      findOptions.where = { tenantId };
    }

    return await super.findAll(findOptions);
  }

  async findOneByTenant(id: string, tenantId: string | null): Promise<Project> {
    const findOptions: any = {
      where: { id },
      relations: ['client'],
    };

    if (tenantId) {
      findOptions.where.tenantId = tenantId;
    }

    const project = await this.projectsRepository.findById(id, findOptions);

    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }

    return project;
  }

  async updateProject(id: string, updateProjectDto: UpdateProjectDto, tenantId: string | null): Promise<Project | null> {
    await this.findOneByTenant(id, tenantId);
    return await super.update(id, updateProjectDto);
  }

  async removeProject(id: string, tenantId: string | null): Promise<void> {
    await this.findOneByTenant(id, tenantId);
    return await super.delete(id);
  }
}
