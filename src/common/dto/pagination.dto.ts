import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {IsOptional, IsPositive, Min } from "class-validator";


export class PaginationDto {
  

  @ApiProperty({
    type: Number,
    description: 'How many rows to skip',
    default: 0
  })
  @IsOptional()
  @Min(0)
  @Type( () => Number)
  offset?: number;


  @ApiProperty({
    type: Number,
    description: 'How many items to return',
    default: 10
  })
  @IsPositive()
  @IsOptional()
  @Type( () => Number)
  limit?: number;
}