import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Comment } from './entities/comment.entity';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post()
  @ApiOperation({ summary: 'Criar um novo comentário' })
  @ApiResponse({ status: 201, description: 'Comentário criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  async create(
    @Request() req: any,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    return this.commentsService.create(createCommentDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os comentários' })
  @ApiResponse({ status: 200, description: 'Lista de comentários retornada com sucesso.' })
  async findAll(): Promise<Comment[]> {
    return this.commentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um comentário por ID' })
  @ApiResponse({ status: 200, description: 'Comentário encontrado.' })
  @ApiResponse({ status: 404, description: 'Comentário não encontrado.' })
  async findOne(@Param('id') id: string): Promise<Comment> {
    return this.commentsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um comentário' })
  @ApiResponse({ status: 200, description: 'Comentário atualizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 403, description: 'Você só pode editar seus próprios comentários.' })
  @ApiResponse({ status: 404, description: 'Comentário não encontrado.' })
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    return this.commentsService.update(id, updateCommentDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir um comentário' })
  @ApiResponse({ status: 204, description: 'Comentário excluído com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 403, description: 'Você só pode excluir seus próprios comentários.' })
  @ApiResponse({ status: 404, description: 'Comentário não encontrado.' })
  async remove(@Request() req: any, @Param('id') id: string): Promise<void> {
    return this.commentsService.remove(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('user/my-comments')
  @ApiOperation({ summary: 'Listar comentários do usuário logado' })
  @ApiResponse({ status: 200, description: 'Lista de comentários do usuário retornada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  async findMyComments(@Request() req: any): Promise<Comment[]> {
    return this.commentsService.findByUserId(req.user.id);
  }
}

