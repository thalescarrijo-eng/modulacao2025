import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { publicAPI } from '../lib/api';
import { Trophy, Medal, Target, Filter } from 'lucide-react';

const ClassificationPage = () => {
  const [selectedCompetition, setSelectedCompetition] = useState('');

  const { data: competitions } = useQuery({
    queryKey: ['competitions'],
    queryFn: () => publicAPI.getCompetitions().then(res => res.data),
  });

  const { data: classification, isLoading, error } = useQuery({
    queryKey: ['classification', selectedCompetition],
    queryFn: () => {
      if (!selectedCompetition) return [];
      return publicAPI.getClassification(selectedCompetition).then(res => res.data);
    },
    enabled: !!selectedCompetition,
  });

  const getPositionIcon = (position) => {
    switch (position) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-600">{position}</span>;
    }
  };

  const getPositionColor = (position) => {
    switch (position) {
      case 1:
        return 'bg-yellow-50 border-yellow-200';
      case 2:
        return 'bg-gray-50 border-gray-200';
      case 3:
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const selectedCompetitionData = competitions?.find(c => c.id.toString() === selectedCompetition);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Target className="h-8 w-8 text-blue-600" />
            Classificação
          </h1>
          <p className="text-gray-600 mt-1">
            Acompanhe a classificação das equipes por competição
          </p>
        </div>
        {classification && (
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">{classification.length}</p>
            <p className="text-sm text-gray-600">Times</p>
          </div>
        )}
      </div>

      {/* Competition Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Selecionar Competição
          </CardTitle>
          <CardDescription>
            Escolha uma competição para visualizar a classificação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-md">
            <Select value={selectedCompetition} onValueChange={setSelectedCompetition}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma competição" />
              </SelectTrigger>
              <SelectContent>
                {competitions?.map((comp) => (
                  <SelectItem key={comp.id} value={comp.id.toString()}>
                    {comp.titulo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Competition Info */}
      {selectedCompetitionData && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">{selectedCompetitionData.titulo}</h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span>Modalidade: {selectedCompetitionData.modalidade}</span>
                  <span>Gênero: {selectedCompetitionData.genero}</span>
                  <span>Categoria: {selectedCompetitionData.subCategoria}</span>
                </div>
              </div>
              <Badge 
                className={
                  selectedCompetitionData.status === 'Em andamento' 
                    ? 'bg-green-100 text-green-800' 
                    : selectedCompetitionData.status === 'Planejada'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }
              >
                {selectedCompetitionData.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Classification Table */}
      {!selectedCompetition ? (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Selecione uma Competição
            </h3>
            <p className="text-gray-600">
              Escolha uma competição acima para visualizar a classificação dos times.
            </p>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando classificação...</p>
          </div>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-red-600">Erro ao carregar classificação. Tente novamente.</p>
          </CardContent>
        </Card>
      ) : !classification || classification.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhum dado de classificação
            </h3>
            <p className="text-gray-600">
              Ainda não há jogos finalizados para esta competição.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Tabela de Classificação</CardTitle>
            <CardDescription>
              Classificação baseada em: Vitória = 3 pontos, Empate = 1 ponto, Derrota = 0 pontos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">Pos</th>
                      <th className="text-left py-3 px-2">Time</th>
                      <th className="text-left py-3 px-2">Escola</th>
                      <th className="text-center py-3 px-2">J</th>
                      <th className="text-center py-3 px-2">V</th>
                      <th className="text-center py-3 px-2">E</th>
                      <th className="text-center py-3 px-2">D</th>
                      <th className="text-center py-3 px-2">GP</th>
                      <th className="text-center py-3 px-2">GC</th>
                      <th className="text-center py-3 px-2">SG</th>
                      <th className="text-center py-3 px-2 font-bold">PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classification.map((team, index) => (
                      <tr 
                        key={team.time.id} 
                        className={`border-b hover:bg-gray-50 ${getPositionColor(team.posicao)}`}
                      >
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            {getPositionIcon(team.posicao)}
                            <span className="font-medium">{team.posicao}º</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 font-medium">{team.time.nome}</td>
                        <td className="py-3 px-2 text-sm text-gray-600">{team.time.escola}</td>
                        <td className="py-3 px-2 text-center">{team.jogos}</td>
                        <td className="py-3 px-2 text-center text-green-600 font-medium">{team.vitorias}</td>
                        <td className="py-3 px-2 text-center text-yellow-600">{team.empates}</td>
                        <td className="py-3 px-2 text-center text-red-600">{team.derrotas}</td>
                        <td className="py-3 px-2 text-center">{team.golsPro}</td>
                        <td className="py-3 px-2 text-center">{team.golsContra}</td>
                        <td className="py-3 px-2 text-center">
                          <span className={team.saldoGols >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {team.saldoGols > 0 ? '+' : ''}{team.saldoGols}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center font-bold text-blue-600">{team.pontos}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {classification.map((team) => (
                <div 
                  key={team.time.id}
                  className={`border rounded-lg p-4 ${getPositionColor(team.posicao)}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getPositionIcon(team.posicao)}
                      <div>
                        <p className="font-semibold">{team.time.nome}</p>
                        <p className="text-sm text-gray-600">{team.time.escola}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{team.pontos}</p>
                      <p className="text-xs text-gray-600">pontos</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 text-sm">
                    <div className="text-center">
                      <p className="text-gray-600">J</p>
                      <p className="font-medium">{team.jogos}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-green-600">V</p>
                      <p className="font-medium text-green-600">{team.vitorias}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-yellow-600">E</p>
                      <p className="font-medium text-yellow-600">{team.empates}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-red-600">D</p>
                      <p className="font-medium text-red-600">{team.derrotas}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>Gols: {team.golsPro} / {team.golsContra}</span>
                    <span className={team.saldoGols >= 0 ? 'text-green-600' : 'text-red-600'}>
                      Saldo: {team.saldoGols > 0 ? '+' : ''}{team.saldoGols}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      {classification && classification.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Legenda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div><strong>Pos:</strong> Posição</div>
              <div><strong>J:</strong> Jogos</div>
              <div><strong>V:</strong> Vitórias</div>
              <div><strong>E:</strong> Empates</div>
              <div><strong>D:</strong> Derrotas</div>
              <div><strong>GP:</strong> Gols Pró</div>
              <div><strong>GC:</strong> Gols Contra</div>
              <div><strong>SG:</strong> Saldo de Gols</div>
              <div><strong>PTS:</strong> Pontos</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClassificationPage;

