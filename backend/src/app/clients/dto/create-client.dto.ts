import { IsEmail, IsNotEmpty, IsOptional, IsString, IsEnum, IsUUID } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: string;

  @IsString()
  @IsUUID()
  @IsOptional()
  tenantId?: string;
}
