import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { publicAPI } from '../lib/api';
import { BarChart3, Trophy, Target, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ResultsPage = () => {
  const [competicaoFilter, setCompeticaoFilter] = useState('');

  const { data: games, isLoading, error } = useQuery({
    queryKey: ['finished-games', competicaoFilter],
    queryFn: () => {
      const params = { status: 'Encerrado' };
      if (competicaoFilter) params.competicaoId = competicaoFilter;
      return publicAPI.getGames(params).then(res => res.data);
    },
  });

  const { data: competitions } = useQuery({
    queryKey: ['competitions'],
    queryFn: () => publicAPI.getCompetitions().then(res => res.data),
  });

  const formatGameDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  const getWinnerInfo = (game) => {
    if (game.placarCasa === null || game.placarFora === null) {
      return { winner: null, isDraw: false };
    }
    
    if (game.placarCasa > game.placarFora) {
      return { winner: 'casa', isDraw: false };
    } else if (game.placarFora > game.placarCasa) {
      return { winner: 'fora', isDraw: false };
    } else {
      return { winner: null, isDraw: true };
    }
  };

  const groupGamesByCompetition = (games) => {
    if (!games) return {};
    
    return games.reduce((acc, game) => {
      const compId = game.competicao.id;
      if (!acc[compId]) {
        acc[compId] = {
          competition: game.competicao,
          games: []
        };
      }
      acc[compId].games.push(game);
      return acc;
    }, {});
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando resultados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Erro ao carregar resultados. Tente novamente.</p>
      </div>
    );
  }

  const groupedGames = groupGamesByCompetition(games);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            Resultados
          </h1>
          <p className="text-gray-600 mt-1">
            Confira os resultados dos jogos já realizados
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600">{games?.length || 0}</p>
          <p className="text-sm text-gray-600">Jogos Finalizados</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            
            {competicaoFilter && (
              <div className="flex items-end">
                <Button variant="outline" onClick={() => setCompeticaoFilter('')}>
                  Limpar Filtro
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {!games || games.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhum resultado encontrado
            </h3>
            <p className="text-gray-600">
              Ainda não há jogos finalizados ou que correspondam aos filtros selecionados.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.values(groupedGames).map(({ competition, games: compGames }) => (
            <Card key={competition.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-blue-600" />
                  {competition.titulo}
                </CardTitle>
                <CardDescription>
                  {compGames.length} jogo(s) finalizado(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {compGames
                    .sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora))
                    .map((game) => {
                      const winnerInfo = getWinnerInfo(game);
                      
                      return (
                        <div 
                          key={game.id}
                          className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            {/* Game Result */}
                            <div className="flex-1">
                              <div className="flex items-center justify-center gap-4 mb-2">
                                <div className={`text-center flex-1 ${winnerInfo.winner === 'casa' ? 'font-bold text-green-600' : ''}`}>
                                  <p className="font-semibold">{game.timeCasa.nome}</p>
                                  <p className="text-sm text-gray-600">{game.timeCasa.escola}</p>
                                </div>
                                
                                <div className="text-center px-4">
                                  <div className="text-2xl font-bold">
                                    {game.placarCasa} × {game.placarFora}
                                  </div>
                                  {winnerInfo.isDraw && (
                                    <Badge variant="secondary" className="mt-1">
                                      Empate
                                    </Badge>
                                  )}
                                </div>

                                <div className={`text-center flex-1 ${winnerInfo.winner === 'fora' ? 'font-bold text-green-600' : ''}`}>
                                  <p className="font-semibold">{game.timeFora.nome}</p>
                                  <p className="text-sm text-gray-600">{game.timeFora.escola}</p>
                                </div>
                              </div>
                              
                              {winnerInfo.winner && !winnerInfo.isDraw && (
                                <div className="text-center">
                                  <Badge className="bg-green-100 text-green-800">
                                    <Trophy className="h-3 w-3 mr-1" />
                                    Vencedor: {winnerInfo.winner === 'casa' ? game.timeCasa.nome : game.timeFora.nome}
                                  </Badge>
                                </div>
                              )}
                            </div>

                            {/* Game Details */}
                            <div className="lg:text-right space-y-1">
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Data:</span> {formatGameDate(game.dataHora)}
                              </div>
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Local:</span> {game.local}
                              </div>
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Rodada:</span> {game.rodada}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {games && games.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas dos Resultados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {games.length}
                </p>
                <p className="text-sm text-gray-600">Total de Jogos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {games.filter(g => {
                    const info = getWinnerInfo(g);
                    return info.winner && !info.isDraw;
                  }).length}
                </p>
                <p className="text-sm text-gray-600">Com Vencedor</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {games.filter(g => getWinnerInfo(g).isDraw).length}
                </p>
                <p className="text-sm text-gray-600">Empates</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {Object.keys(groupedGames).length}
                </p>
                <p className="text-sm text-gray-600">Competições</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResultsPage;

