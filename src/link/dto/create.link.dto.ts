/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateLinkDto {
  @IsNotEmpty()
  @IsString()
  originalUrl: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  lifetime?: number;
}
