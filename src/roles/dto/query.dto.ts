import { IsOptional, IsString } from 'class-validator';

export class QueryDto {
  @IsOptional()
  @IsString()
  filters: string;

  @IsOptional()
  @IsString()
  fields: string;

  @IsOptional()
  @IsString()
  id: string;
}
