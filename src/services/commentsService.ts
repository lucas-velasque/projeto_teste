import api from './api';

export interface Comment {
  id: string;
  content: string;
  user_id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateCommentDto {
  content: string;
}

export interface UpdateCommentDto {
  content: string;
}

export const commentsService = {
  // Listar todos os comentários
  async getComments(): Promise<Comment[]> {
    try {
      console.log('[COMMENTS SERVICE] === BUSCANDO COMENTÁRIOS ===');
      console.log('[COMMENTS SERVICE] Token:', typeof window !== 'undefined' ? localStorage.getItem('token') : 'N/A');
      
      const { data } = await api.get<Comment[]>('/comments');
      console.log('[COMMENTS SERVICE] Comentários retornados pela API:', data);
      console.log('[COMMENTS SERVICE] Número de comentários:', data.length);
      
      return data;
    } catch (error: any) {
      console.error('[COMMENTS SERVICE] Erro ao buscar comentários:', error);
      console.error('[COMMENTS SERVICE] Response data:', error.response?.data);
      throw error;
    }
  },

  // Obter comentário por ID
  async getCommentById(id: string): Promise<Comment> {
    const { data } = await api.get<Comment>(`/comments/${id}`);
    return data;
  },

  // Criar novo comentário
  async createComment(commentData: CreateCommentDto): Promise<Comment> {
    console.log('[COMMENTS SERVICE] createComment chamado com dados:', commentData);
    console.log('[COMMENTS SERVICE] Token:', typeof window !== 'undefined' ? localStorage.getItem('token') : 'N/A');
    
    try {
      const { data } = await api.post<Comment>('/comments', commentData);
      console.log('[COMMENTS SERVICE] Comentário criado com sucesso:', data);
      return data;
    } catch (error: any) {
      console.error('[COMMENTS SERVICE] Erro ao criar comentário:', error);
      if (error.response) {
        console.error('[COMMENTS SERVICE] Status:', error.response.status);
        console.error('[COMMENTS SERVICE] Data:', error.response.data);
      } else {
        console.error('[COMMENTS SERVICE] Erro inesperado:', error.message || error);
      }
      throw error;
    }
  },

  // Atualizar comentário
  async updateComment(id: string, commentData: UpdateCommentDto): Promise<Comment> {
    console.log('[COMMENTS SERVICE] updateComment chamado com ID:', id, 'e dados:', commentData);
    console.log('[COMMENTS SERVICE] Token:', typeof window !== 'undefined' ? localStorage.getItem('token') : 'N/A');
    
    try {
      const { data } = await api.patch<Comment>(`/comments/${id}`, commentData);
      console.log('[COMMENTS SERVICE] Comentário atualizado com sucesso:', data);
      return data;
    } catch (error: any) {
      console.error('[COMMENTS SERVICE] Erro ao atualizar comentário:', error);
      console.error('[COMMENTS SERVICE] Status:', error.response?.status);
      console.error('[COMMENTS SERVICE] Data:', error.response?.data);
      throw error;
    }
  },

  // Deletar comentário
  async deleteComment(id: string): Promise<void> {
    console.log('[COMMENTS SERVICE] deleteComment chamado com ID:', id);
    console.log('[COMMENTS SERVICE] Token:', typeof window !== 'undefined' ? localStorage.getItem('token') : 'N/A');
    
    try {
      await api.delete(`/comments/${id}`);
      console.log('[COMMENTS SERVICE] Comentário deletado com sucesso');
    } catch (error: any) {
      console.error('[COMMENTS SERVICE] Erro ao deletar comentário:', error);
      console.error('[COMMENTS SERVICE] Status:', error.response?.status);
      console.error('[COMMENTS SERVICE] Data:', error.response?.data);
      throw error;
    }
  },

  // Obter comentários do usuário logado
  async getMyComments(): Promise<Comment[]> {
    try {
      console.log('[COMMENTS SERVICE] === BUSCANDO MEUS COMENTÁRIOS ===');
      console.log('[COMMENTS SERVICE] Token:', typeof window !== 'undefined' ? localStorage.getItem('token') : 'N/A');
      
      const { data } = await api.get<Comment[]>('/comments/user/my-comments');
      console.log('[COMMENTS SERVICE] Meus comentários retornados pela API:', data);
      console.log('[COMMENTS SERVICE] Número de meus comentários:', data.length);
      
      return data;
    } catch (error: any) {
      console.error('[COMMENTS SERVICE] Erro ao buscar meus comentários:', error);
      console.error('[COMMENTS SERVICE] Response data:', error.response?.data);
      throw error;
    }
  },
};

