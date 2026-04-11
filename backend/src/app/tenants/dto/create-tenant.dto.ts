import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateTenantDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;
}
