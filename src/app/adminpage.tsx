'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import {
  Users,
  Building,
  Calendar,
  Heart,
  CreditCard,
  CheckSquare,
  LogOut
} from 'lucide-react';
import Button from '@/components/common/Button';

export default function AdminPage() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      if (!window.location.pathname.includes('/auth/login-admin')) {
        router.push('/auth/login-admin');
      }
    }
  }, [isAuthenticated, user, router, isLoading]);

  const handleLogout = () => {
    logout();
  };

  const modules = [
    {
      title: 'Usuários',
      description: 'Gerenciar usuários do sistema',
      icon: Users,
      href: '/users',
      color: 'bg-blue-500',
    },
    {
      title: 'Propriedades',
      description: 'Cadastrar e gerenciar imóveis',
      icon: Building,
      href: '/properties',
      color: 'bg-green-500',
    },
    {
      title: 'Agendamentos',
      description: 'Controle de visitas e reservas',
      icon: Calendar,
      href: '/bookings',
      color: 'bg-purple-500',
    },
    {
      title: 'Assistência Social',
      description: 'Programas de assistência social',
      icon: Heart,
      href: '/social-assistance',
      color: 'bg-red-500',
    },
    {
              title: 'Créditos de Serviço',
              description: 'Sistema de créditos de serviço e benefícios',
      icon: CreditCard,
      href: '/work-credits',
      color: 'bg-yellow-500',
    },
    {
      title: 'Tarefas',
      description: 'Gerenciamento de tarefas',
      icon: CheckSquare,
      href: '/tasks',
      color: 'bg-indigo-500',
    },
  ];

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Painel do Administrador
              </h1>
              <p className="text-sm text-gray-600">
                Bem-vindo, {user?.name}
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Módulos do Administrador
            </h2>
            <p className="text-gray-600">
              Selecione um módulo para acessar suas funcionalidades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => {
              const IconComponent = module.icon;
              return (
                <Link
                  key={module.title}
                  href={module.href}
                  className="block group"
                >
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center">
                      <div className={`${module.color} p-3 rounded-lg`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {module.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {module.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
} 