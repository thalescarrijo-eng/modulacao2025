import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { publicAPI } from '../lib/api';
import { School, Users, Search } from 'lucide-react';

const SchoolsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: schools, isLoading, error } = useQuery({
    queryKey: ['schools'],
    queryFn: () => publicAPI.getSchools().then(res => res.data),
  });

  // Filter schools based on search term
  const filteredSchools = schools?.filter(school =>
    school.nome.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando escolas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Erro ao carregar escolas. Tente novamente.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <School className="h-8 w-8 text-blue-600" />
            Escolas Participantes
          </h1>
          <p className="text-gray-600 mt-1">
            Conheça todas as escolas que participam da Copa Escolar Municipal
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600">{filteredSchools.length}</p>
          <p className="text-sm text-gray-600">Escolas</p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Escola
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-md">
            <Input
              placeholder="Digite o nome da escola..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm && (
            <p className="text-sm text-gray-600 mt-2">
              {filteredSchools.length} escola(s) encontrada(s)
            </p>
          )}
        </CardContent>
      </Card>

      {/* Schools Grid */}
      {filteredSchools.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <School className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {schools?.length === 0 ? 'Nenhuma escola cadastrada' : 'Nenhuma escola encontrada'}
            </h3>
            <p className="text-gray-600">
              {schools?.length === 0 
                ? 'Ainda não há escolas cadastradas no sistema.'
                : 'Tente ajustar o termo de busca para encontrar escolas.'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchools.map((school) => (
            <Card key={school.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <School className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight">{school.nome}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>Escola Municipal</span>
                </div>
                
                <div className="pt-3 border-t">
                  <div className="text-xs text-gray-500">
                    <p><strong>Cadastrada em:</strong> {new Date(school.createdAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* School Statistics */}
      {schools && schools.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Informações Gerais</CardTitle>
            <CardDescription>
              Dados sobre as escolas participantes da Copa Escolar Municipal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="p-4 bg-blue-50 rounded-lg mb-3">
                  <School className="h-8 w-8 text-blue-600 mx-auto" />
                </div>
                <p className="text-2xl font-bold text-blue-600">{schools.length}</p>
                <p className="text-sm text-gray-600">Total de Escolas</p>
              </div>
              
              <div className="text-center">
                <div className="p-4 bg-green-50 rounded-lg mb-3">
                  <Users className="h-8 w-8 text-green-600 mx-auto" />
                </div>
                <p className="text-2xl font-bold text-green-600">100%</p>
                <p className="text-sm text-gray-600">Escolas Municipais</p>
              </div>
              
              <div className="text-center">
                <div className="p-4 bg-purple-50 rounded-lg mb-3">
                  <School className="h-8 w-8 text-purple-600 mx-auto" />
                </div>
                <p className="text-2xl font-bold text-purple-600">Ativa</p>
                <p className="text-sm text-gray-600">Participação</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* About Schools */}
      <Card>
        <CardHeader>
          <CardTitle>Sobre as Escolas Participantes</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="text-gray-600 mb-4">
            A Copa Escolar Municipal conta com a participação de escolas da rede municipal de ensino, 
            promovendo o esporte e a integração entre as instituições educacionais.
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Modalidades Oferecidas:</h4>
            <ul className="text-blue-800 space-y-1">
              <li>• <strong>Futsal:</strong> Masculino e Feminino (SUB-09 e SUB-11)</li>
              <li>• <strong>Queimada:</strong> Masculino e Feminino (SUB-09 e SUB-11)</li>
            </ul>
          </div>
          
          <p className="text-gray-600 mt-4">
            Cada escola pode inscrever times nas diferentes categorias e modalidades, 
            sendo representada por professores responsáveis que gerenciam as equipes 
            e acompanham os jogos.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchoolsPage;

