import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

export class PermissionDto {
  @IsString()
  @IsNotEmpty()
  roleId: string;

  @IsString()
  @IsNotEmpty()
  moduleId: string;

  @IsBoolean()
  @IsNotEmpty()
  fullAccess: boolean;

  @IsArray()
  @IsNotEmpty()
  actions: Array<string>;

  @IsString()
  @IsOptional()
  createdAt?: string;

  @IsString()
  @IsOptional()
  updatedAt?: string;

  @IsString()
  @IsOptional()
  deletedAt?: string;
}

export class UpdatePermissionDto extends PartialType(PermissionDto) {}

export class MultiPermissionDTO {
  @IsString()
  @IsNotEmpty()
  roleId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionDto)
  @IsNotEmpty()
  permissions: Array<PermissionDto>;
}
