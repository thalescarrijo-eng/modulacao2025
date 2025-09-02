import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { publicAPI } from '../lib/api';
import { Trophy, Users, Calendar, Filter } from 'lucide-react';

const CompetitionsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalidadeFilter, setModalidadeFilter] = useState('');
  const [generoFilter, setGeneroFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data: competitions, isLoading, error } = useQuery({
    queryKey: ['competitions'],
    queryFn: () => publicAPI.getCompetitions().then(res => res.data),
  });

  const { data: schools } = useQuery({
    queryKey: ['schools'],
    queryFn: () => publicAPI.getSchools().then(res => res.data),
  });

  // Filter competitions based on search and filters
  const filteredCompetitions = competitions?.filter(competition => {
    const matchesSearch = competition.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModalidade = !modalidadeFilter || competition.modalidade === modalidadeFilter;
    const matchesGenero = !generoFilter || competition.genero === generoFilter;
    const matchesStatus = !statusFilter || competition.status === statusFilter;
    
    return matchesSearch && matchesModalidade && matchesGenero && matchesStatus;
  }) || [];

  const clearFilters = () => {
    setSearchTerm('');
    setModalidadeFilter('');
    setGeneroFilter('');
    setStatusFilter('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Em andamento':
        return 'bg-green-100 text-green-800';
      case 'Planejada':
        return 'bg-blue-100 text-blue-800';
      case 'Encerrada':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getModalidadeIcon = (modalidade) => {
    return modalidade === 'Futsal' ? '⚽' : '🏐';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando competições...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Erro ao carregar competições. Tente novamente.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Trophy className="h-8 w-8 text-blue-600" />
            Competições
          </h1>
          <p className="text-gray-600 mt-1">
            Acompanhe todas as competições da Copa Escolar Municipal
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600">{filteredCompetitions.length}</p>
          <p className="text-sm text-gray-600">Competições</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Buscar
              </label>
              <Input
                placeholder="Nome da competição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Modalidade
              </label>
              <Select value={modalidadeFilter} onValueChange={setModalidadeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  <SelectItem value="Futsal">Futsal</SelectItem>
                  <SelectItem value="Queimada">Queimada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Gênero
              </label>
              <Select value={generoFilter} onValueChange={setGeneroFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                  <SelectItem value="Feminino">Feminino</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Status
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="Planejada">Planejada</SelectItem>
                  <SelectItem value="Em andamento">Em andamento</SelectItem>
                  <SelectItem value="Encerrada">Encerrada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {(searchTerm || modalidadeFilter || generoFilter || statusFilter) && (
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                {filteredCompetitions.length} competição(ões) encontrada(s)
              </p>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Competitions Grid */}
      {filteredCompetitions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhuma competição encontrada
            </h3>
            <p className="text-gray-600">
              {competitions?.length === 0 
                ? 'Ainda não há competições cadastradas no sistema.'
                : 'Tente ajustar os filtros para encontrar competições.'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompetitions.map((competition) => (
            <Card key={competition.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getModalidadeIcon(competition.modalidade)}</span>
                    <Badge className={getStatusColor(competition.status)}>
                      {competition.status}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-lg">{competition.titulo}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Modalidade</p>
                    <p className="font-medium">{competition.modalidade}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Gênero</p>
                    <p className="font-medium">{competition.genero}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Categoria</p>
                    <p className="font-medium">{competition.subCategoria}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <p className="font-medium">{competition.status}</p>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>Ver times</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Ver jogos</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {competitions && competitions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resumo das Competições</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {competitions.filter(c => c.modalidade === 'Futsal').length}
                </p>
                <p className="text-sm text-gray-600">Futsal</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {competitions.filter(c => c.modalidade === 'Queimada').length}
                </p>
                <p className="text-sm text-gray-600">Queimada</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {competitions.filter(c => c.genero === 'Masculino').length}
                </p>
                <p className="text-sm text-gray-600">Masculino</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-pink-600">
                  {competitions.filter(c => c.genero === 'Feminino').length}
                </p>
                <p className="text-sm text-gray-600">Feminino</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CompetitionsPage;

