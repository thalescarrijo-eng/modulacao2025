import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Users, 
  School, 
  Trophy, 
  Calendar, 
  FileText,
  BarChart3,
  Shield
} from 'lucide-react';

const AdminDashboard = () => {
  // This is a placeholder component - will be implemented with actual API calls
  // when we implement the admin-specific backend routes
  
  const adminSections = [
    {
      title: 'Competições',
      description: 'Gerenciar competições e modalidades',
      icon: Trophy,
      color: 'text-blue-600 bg-blue-100',
      items: ['Criar competições', 'Editar modalidades', 'Definir status']
    },
    {
      title: 'Escolas',
      description: 'Administrar escolas participantes',
      icon: School,
      color: 'text-green-600 bg-green-100',
      items: ['Cadastrar escolas', 'Editar informações', 'Gerenciar participação']
    },
    {
      title: 'Professores',
      description: 'Gerenciar professores e acessos',
      icon: Users,
      color: 'text-purple-600 bg-purple-100',
      items: ['Criar logins', 'Vincular escolas', 'Reset senhas']
    },
    {
      title: 'Times',
      description: 'Administrar times e atletas',
      icon: Users,
      color: 'text-orange-600 bg-orange-100',
      items: ['Criar times', 'Gerenciar elencos', 'Validar inscrições']
    },
    {
      title: 'Jogos',
      description: 'Controlar jogos e resultados',
      icon: Calendar,
      color: 'text-red-600 bg-red-100',
      items: ['Gerar confrontos', 'Lançar placares', 'Encerrar jogos']
    },
    {
      title: 'Recursos',
      description: 'Moderar recursos e pedidos',
      icon: FileText,
      color: 'text-yellow-600 bg-yellow-100',
      items: ['Analisar recursos', 'Deferir/Indeferir', 'Histórico']
    }
  ];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-600" />
            Painel Administrativo
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie todos os aspectos da Copa Escolar Municipal
          </p>
        </div>
        <Badge className="bg-red-100 text-red-800">
          Administrador
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Competições</p>
                <p className="text-2xl font-bold">6</p>
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
                <p className="text-2xl font-bold">10</p>
              </div>
              <School className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Professores</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Times</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminSections.map((section, index) => {
          const Icon = section.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${section.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {section.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="text-sm text-gray-600 space-y-1">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  Acessar {section.title}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Development Notice */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-yellow-600" />
            <div>
              <h3 className="font-semibold text-yellow-900">
                Área Administrativa em Desenvolvimento
              </h3>
              <p className="text-yellow-800 mt-1">
                As funcionalidades administrativas completas serão implementadas na próxima fase. 
                Atualmente, o sistema possui a estrutura básica com autenticação, modelos de dados 
                e APIs públicas funcionando.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Informações do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Funcionalidades Implementadas:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✅ Sistema de autenticação JWT</li>
                <li>✅ Controle de acesso por roles</li>
                <li>✅ Banco de dados com seeding</li>
                <li>✅ APIs públicas (competições, jogos, etc.)</li>
                <li>✅ Interface responsiva</li>
                <li>✅ Navegação por roles</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Próximas Implementações:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>🔄 CRUD completo para administradores</li>
                <li>🔄 Área do professor (times e jogos)</li>
                <li>🔄 Sistema de recursos/pedidos</li>
                <li>🔄 Logs de auditoria</li>
                <li>🔄 Geração de confrontos</li>
                <li>🔄 Testes automatizados</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;

