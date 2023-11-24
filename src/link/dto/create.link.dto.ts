/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateLinkDto {
  @ApiProperty({
    example: 'https://www.youtube.com/watch?v=Qu-7GY6ftE4',
    description: 'Original Url',
  })
  @IsNotEmpty()
  @IsString()
  readonly originalUrl: string;

  @ApiProperty({ example: '12', description: 'Lifetime URL' })
  @IsOptional()
  @IsInt()
  @Min(1)
  readonly lifetime?: number;
}
