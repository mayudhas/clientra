import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email?: string;
}
