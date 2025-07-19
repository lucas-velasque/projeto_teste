'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { commentsService, Comment, CreateCommentDto, UpdateCommentDto } from '@/services/commentsService';
import Button from '@/components/common/Button';
import toast from 'react-hot-toast';

const CommentsPage: React.FC = () => {
  const { user: currentUser, isLoading: authLoading, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [form, setForm] = useState<CreateCommentDto>({
    content: '',
  });

  // Debug logs
  console.log('[COMMENTS PAGE] User:', currentUser);
  console.log('[COMMENTS PAGE] Is authenticated:', isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;
    loadComments();
  }, [isAuthenticated]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const data = await commentsService.getComments();
      setComments(data);
      setError(null);
    } catch (err) {
      setError('Erro ao buscar comentários');
      console.error('Erro ao carregar comentários:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.content.trim()) {
      toast.error('O comentário não pode estar vazio');
      return;
    }

    if (form.content.length > 200) {
      toast.error('O comentário deve ter no máximo 200 caracteres');
      return;
    }

    try {
      if (editingComment) {
        // Atualizar comentário existente
        await commentsService.updateComment(editingComment.id, form as UpdateCommentDto);
        toast.success('Comentário atualizado com sucesso!');
      } else {
        // Criar novo comentário
        await commentsService.createComment(form);
        toast.success('Comentário criado com sucesso!');
      }
      
      // Resetar formulário e recarregar comentários
      setForm({ content: '' });
      setShowForm(false);
      setEditingComment(null);
      await loadComments();
    } catch (err: any) {
      console.error('Erro ao salvar comentário:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao salvar comentário';
      toast.error(errorMessage);
    }
  };

  const handleEdit = (comment: Comment) => {
    setEditingComment(comment);
    setForm({ content: comment.content });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Deseja excluir este comentário?')) return;
    
    try {
      await commentsService.deleteComment(id);
      toast.success('Comentário excluído com sucesso!');
      await loadComments();
    } catch (err: any) {
      console.error('Erro ao excluir comentário:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao excluir comentário';
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    setForm({ content: '' });
    setShowForm(false);
    setEditingComment(null);
  };

  const canEditOrDelete = (comment: Comment) => {
    return currentUser && comment.user_id === currentUser.id;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  if (authLoading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
          <p>Você precisa estar logado para ver os comentários.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Comentários</h1>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {showForm ? 'Cancelar' : 'Novo Comentário'}
        </Button>
      </div>

      {/* Formulário para criar/editar comentário */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingComment ? 'Editar Comentário' : 'Novo Comentário'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Comentário ({form.content.length}/200)
              </label>
              <textarea
                id="content"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                maxLength={200}
                placeholder="Digite seu comentário aqui..."
                required
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700"
              >
                {editingComment ? 'Atualizar' : 'Criar'}
              </Button>
              <Button
                type="button"
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-700"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de comentários */}
      {loading ? (
        <div className="flex justify-center">
          <div className="text-lg">Carregando comentários...</div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">Nenhum comentário encontrado.</p>
          <p className="text-gray-400">Seja o primeiro a comentar!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{comment.user.name}</h3>
                  <p className="text-sm text-gray-500">{formatDate(comment.created_at)}</p>
                  {comment.created_at !== comment.updated_at && (
                    <p className="text-xs text-gray-400">
                      Editado em {formatDate(comment.updated_at)}
                    </p>
                  )}
                </div>
                {canEditOrDelete(comment) && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(comment)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-sm px-3 py-1"
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDelete(comment.id)}
                      className="bg-red-600 hover:bg-red-700 text-sm px-3 py-1"
                    >
                      Excluir
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-gray-800 whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentsPage;

