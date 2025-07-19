import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Conteúdo do comentário',
    example: 'Este é um comentário sobre o sistema.',
    minLength: 1,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'O comentário deve ter pelo menos 1 caractere' })
  @MaxLength(200, { message: 'O comentário deve ter no máximo 200 caracteres' })
  content!: string;
}

