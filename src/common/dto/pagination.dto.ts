import { Type } from "class-transformer";
import {IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
    
  @IsOptional()
  @Min(0)
  @Type( () => Number)
  offset?: number;

  @IsPositive()
  @IsOptional()
  @Type( () => Number)
  limit?: number;
}