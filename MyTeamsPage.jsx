import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Edit, Trophy } from 'lucide-react';

const MyTeamsPage = () => {
  // This is a placeholder component - will be implemented with actual API calls
  // when we implement the teacher-specific backend routes
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600" />
            Meus Times
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie seus times e atletas
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Criar Novo Time
        </Button>
      </div>

      {/* Teams List - Placeholder */}
      <Card>
        <CardContent className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Área do Professor em Desenvolvimento
          </h3>
          <p className="text-gray-600 mb-4">
            Esta funcionalidade será implementada na próxima fase do desenvolvimento.
          </p>
          <p className="text-sm text-gray-500">
            Aqui você poderá:
          </p>
          <ul className="text-sm text-gray-500 mt-2 space-y-1">
            <li>• Criar e gerenciar times das suas escolas</li>
            <li>• Cadastrar atletas com números de camisa</li>
            <li>• Editar informações dos times</li>
            <li>• Visualizar estatísticas dos seus times</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyTeamsPage;

