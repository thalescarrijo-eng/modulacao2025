import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { publicAPI } from '../lib/api';
import { Calendar, MapPin, Clock, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const GamesPage = () => {
  const [competicaoFilter, setCompeticaoFilter] = useState('');
  const [escolaFilter, setEscolaFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data: games, isLoading, error } = useQuery({
    queryKey: ['games', competicaoFilter, escolaFilter, statusFilter],
    queryFn: () => {
      const params = {};
      if (competicaoFilter) params.competicaoId = competicaoFilter;
      if (escolaFilter) params.escolaId = escolaFilter;
      if (statusFilter) params.status = statusFilter;
      return publicAPI.getGames(params).then(res => res.data);
    },
  });

  const { data: competitions } = useQuery({
    queryKey: ['competitions'],
    queryFn: () => publicAPI.getCompetitions().then(res => res.data),
  });

  const { data: schools } = useQuery({
    queryKey: ['schools'],
    queryFn: () => publicAPI.getSchools().then(res => res.data),
  });

  const clearFilters = () => {
    setCompeticaoFilter('');
    setEscolaFilter('');
    setStatusFilter('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Em andamento':
        return 'bg-green-100 text-green-800';
      case 'Agendado':
        return 'bg-blue-100 text-blue-800';
      case 'Encerrado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatGameDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando jogos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Erro ao carregar jogos. Tente novamente.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Calendar className="h-8 w-8 text-blue-600" />
            Tabela de Jogos
          </h1>
          <p className="text-gray-600 mt-1">
            Acompanhe todos os jogos da Copa Escolar Municipal
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600">{games?.length || 0}</p>
          <p className="text-sm text-gray-600">Jogos</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Competição
              </label>
              <Select value={competicaoFilter} onValueChange={setCompeticaoFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as competições" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as competições</SelectItem>
                  {competitions?.map((comp) => (
                    <SelectItem key={comp.id} value={comp.id.toString()}>
                      {comp.titulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Escola
              </label>
              <Select value={escolaFilter} onValueChange={setEscolaFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as escolas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as escolas</SelectItem>
                  {schools?.map((school) => (
                    <SelectItem key={school.id} value={school.id.toString()}>
                      {school.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Status
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os status</SelectItem>
                  <SelectItem value="Agendado">Agendado</SelectItem>
                  <SelectItem value="Em andamento">Em andamento</SelectItem>
                  <SelectItem value="Encerrado">Encerrado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {(competicaoFilter || escolaFilter || statusFilter) && (
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                {games?.length || 0} jogo(s) encontrado(s)
              </p>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Games List */}
      {!games || games.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhum jogo encontrado
            </h3>
            <p className="text-gray-600">
              Ainda não há jogos cadastrados ou que correspondam aos filtros selecionados.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {games.map((game) => (
            <Card key={game.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Game Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className={getStatusColor(game.status)}>
                        {game.status}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        Rodada {game.rodada}
                      </span>
                      <span className="text-sm font-medium text-blue-600">
                        {game.competicao.titulo}
                      </span>
                    </div>

                    {/* Teams */}
                    <div className="flex items-center justify-center gap-4 mb-3">
                      <div className="text-center flex-1">
                        <p className="font-semibold text-lg">{game.timeCasa.nome}</p>
                        <p className="text-sm text-gray-600">{game.timeCasa.escola}</p>
                      </div>
                      
                      <div className="text-center px-4">
                        {game.status === 'Encerrado' && game.placarCasa !== null && game.placarFora !== null ? (
                          <div className="text-2xl font-bold">
                            {game.placarCasa} × {game.placarFora}
                          </div>
                        ) : (
                          <div className="text-2xl font-bold text-gray-400">
                            × 
                          </div>
                        )}
                      </div>

                      <div className="text-center flex-1">
                        <p className="font-semibold text-lg">{game.timeFora.nome}</p>
                        <p className="text-sm text-gray-600">{game.timeFora.escola}</p>
                      </div>
                    </div>
                  </div>

                  {/* Game Details */}
                  <div className="lg:text-right space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{formatGameDate(game.dataHora)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{game.local}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GamesPage;

