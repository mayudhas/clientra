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
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UserRole } from '../../common/enums/user-role.enum';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    const isSuperAdmin = req.user.role === UserRole.SUPER_ADMIN;
    const tenantId = req.user.tenantId;

    if (!isSuperAdmin && !tenantId) {
      throw new BadRequestException('Action denied: You must be associated with a tenant to manage projects.');
    }
    
    // For super admin without tenantId, they should probably select a tenant, 
    // but typically projects are created by tenant users.
    // If super admin creates, they need to provide tenantId or we use their tenantId if they have one.
    const finalTenantId = tenantId || (isSuperAdmin ? createProjectDto['tenantId'] : null);
    
    if (!finalTenantId) {
       throw new BadRequestException('Tenant ID is required');
    }

    return this.projectsService.createProject(createProjectDto, finalTenantId);
  }

  @Get()
  findAll(@Request() req) {
    const isSuperAdmin = req.user.role === UserRole.SUPER_ADMIN;
    const tenantId = isSuperAdmin ? null : req.user.tenantId;

    if (!isSuperAdmin && !tenantId) {
      return [];
    }
    return this.projectsService.findAllByTenant(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const isSuperAdmin = req.user.role === UserRole.SUPER_ADMIN;
    const tenantId = isSuperAdmin ? null : req.user.tenantId;
    return this.projectsService.findOneByTenant(id, tenantId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Request() req,
  ) {
    const isSuperAdmin = req.user.role === UserRole.SUPER_ADMIN;
    const tenantId = isSuperAdmin ? null : req.user.tenantId;

    if (!isSuperAdmin && !tenantId) {
      throw new BadRequestException('Action denied: You must be associated with a tenant to manage projects.');
    }
    return this.projectsService.updateProject(id, updateProjectDto, tenantId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const isSuperAdmin = req.user.role === UserRole.SUPER_ADMIN;
    const tenantId = isSuperAdmin ? null : req.user.tenantId;

    if (!isSuperAdmin && !tenantId) {
      throw new BadRequestException('Action denied: You must be associated with a tenant to manage projects.');
    }
    return this.projectsService.removeProject(id, tenantId);
  }
}
