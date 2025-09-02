import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { publicAPI } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { 
  Trophy, 
  Calendar, 
  BarChart3, 
  School, 
  Users, 
  Target,
  ArrowRight
} from 'lucide-react';

const HomePage = () => {
  const { user, isVisitor, isTeacher, isAdmin } = useAuth();

  // Fetch summary data
  const { data: competitions } = useQuery({
    queryKey: ['competitions'],
    queryFn: () => publicAPI.getCompetitions().then(res => res.data),
  });

  const { data: schools } = useQuery({
    queryKey: ['schools'],
    queryFn: () => publicAPI.getSchools().then(res => res.data),
  });

  const { data: recentGames } = useQuery({
    queryKey: ['recent-games'],
    queryFn: () => publicAPI.getGames({ limit: 5 }).then(res => res.data),
  });

  const getWelcomeMessage = () => {
    if (isVisitor()) {
      return {
        title: 'Bem-vindo à Copa Escolar Municipal!',
        subtitle: 'Acompanhe os jogos, resultados e classificações das competições escolares.',
        role: 'Visitante'
      };
    } else if (isTeacher()) {
      return {
        title: `Olá, ${user?.nome || user?.username}!`,
        subtitle: 'Gerencie seus times e acompanhe os jogos das suas equipes.',
        role: 'Professor'
      };
    } else if (isAdmin()) {
      return {
        title: `Bem-vindo, Administrador!`,
        subtitle: 'Gerencie competições, escolas, professores e times do sistema.',
        role: 'Administrador'
      };
    }
    return {
      title: 'Copa Escolar Municipal',
      subtitle: 'Sistema de Gerenciamento Esportivo',
      role: 'Usuário'
    };
  };

  const welcome = getWelcomeMessage();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="h-8 w-8" />
              <Badge variant="secondary" className="bg-white/20 text-white">
                {welcome.role}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">{welcome.title}</h1>
            <p className="text-blue-100 text-lg">{welcome.subtitle}</p>
          </div>
          <div className="hidden md:block">
            <Trophy className="h-24 w-24 opacity-20" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Competições</p>
                <p className="text-2xl font-bold">{competitions?.length || 0}</p>
              </div>
              <Trophy className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Escolas</p>
                <p className="text-2xl font-bold">{schools?.length || 0}</p>
              </div>
              <School className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Jogos Recentes</p>
                <p className="text-2xl font-bold">{recentGames?.length || 0}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Modalidades</p>
                <p className="text-2xl font-bold">2</p>
                <p className="text-xs text-gray-500">Futsal e Queimada</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Navigation Cards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Acompanhar Competições
            </CardTitle>
            <CardDescription>
              Visualize jogos, resultados e classificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/competicoes">
              <Button variant="outline" className="w-full justify-between">
                Ver Competições
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/jogos">
              <Button variant="outline" className="w-full justify-between">
                Tabela de Jogos
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/classificacao">
              <Button variant="outline" className="w-full justify-between">
                Classificação
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Role-specific actions */}
        {isTeacher() && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Área do Professor
              </CardTitle>
              <CardDescription>
                Gerencie seus times e jogos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/meus-times">
                <Button className="w-full justify-between">
                  Meus Times
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/meus-jogos">
                <Button variant="outline" className="w-full justify-between">
                  Meus Jogos
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {isAdmin() && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Área Administrativa
              </CardTitle>
              <CardDescription>
                Gerencie o sistema completo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/admin">
                <Button className="w-full justify-between">
                  Painel Administrativo
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {isVisitor() && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5" />
                Informações Gerais
              </CardTitle>
              <CardDescription>
                Conheça as escolas participantes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/escolas">
                <Button variant="outline" className="w-full justify-between">
                  Ver Escolas
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Activity or Competitions */}
      {competitions && competitions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Competições Disponíveis</CardTitle>
            <CardDescription>
              Acompanhe as competições em andamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {competitions.slice(0, 6).map((competition) => (
                <div 
                  key={competition.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-semibold text-sm mb-2">{competition.titulo}</h3>
                  <div className="space-y-1 text-xs text-gray-600">
                    <p>Modalidade: {competition.modalidade}</p>
                    <p>Gênero: {competition.genero}</p>
                    <p>Categoria: {competition.subCategoria}</p>
                    <Badge 
                      variant={competition.status === 'Em andamento' ? 'default' : 'secondary'}
                      className="mt-2"
                    >
                      {competition.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HomePage;

