import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '../../contexts/AuthContext';
import { Trophy, User, Shield, Eye } from 'lucide-react';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e, userType) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(credentials, userType);
      
      if (result.success) {
        // Redirect based on user role
        if (result.user.role === 'ADM') {
          navigate('/admin');
        } else if (result.user.role === 'PROFESSOR') {
          navigate('/meus-times');
        } else {
          navigate('/');
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleVisitorLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await login({}, 'visitante');
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Trophy className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Copa Escolar Municipal</h1>
          <p className="text-gray-600 mt-2">Sistema de Gerenciamento Esportivo</p>
        </div>

        {/* Visitor Access Button */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <Button 
              onClick={handleVisitorLogin}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              <Eye className="mr-2 h-4 w-4" />
              Entrar como Visitante
            </Button>
            <p className="text-xs text-green-700 mt-2 text-center">
              Acesso público para visualizar jogos, resultados e classificações
            </p>
          </CardContent>
        </Card>

        {/* Login Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>
              Faça login para acessar funcionalidades exclusivas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="professor" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="professor" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Professor
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Administrador
                </TabsTrigger>
              </TabsList>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <TabsContent value="professor" className="space-y-4 mt-4">
                <form onSubmit={(e) => handleSubmit(e, 'professor')} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Usuário</Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Digite seu usuário"
                      value={credentials.username}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Digite sua senha"
                      value={credentials.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? 'Entrando...' : 'Entrar como Professor'}
                  </Button>
                </form>
                <div className="text-xs text-gray-500 mt-2">
                  <p><strong>Senha padrão:</strong> Trocar123!</p>
                  <p>Usuários disponíveis: cristiane.alves, lindonei.junior, alberto, ana.mireile, daiana, domingos, hugo, lorena, poliane.vilela, ana.paula, fernando.machado, marianny</p>
                </div>
              </TabsContent>

              <TabsContent value="admin" className="space-y-4 mt-4">
                <form onSubmit={(e) => handleSubmit(e, 'admin')} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-username">Usuário</Label>
                    <Input
                      id="admin-username"
                      name="username"
                      type="text"
                      placeholder="Digite seu usuário"
                      value={credentials.username}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Senha</Label>
                    <Input
                      id="admin-password"
                      name="password"
                      type="password"
                      placeholder="Digite sua senha"
                      value={credentials.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-red-600 hover:bg-red-700" 
                    disabled={loading}
                  >
                    {loading ? 'Entrando...' : 'Entrar como Administrador'}
                  </Button>
                </form>
                <div className="text-xs text-gray-500 mt-2">
                  <p><strong>Usuário:</strong> admin</p>
                  <p><strong>Senha:</strong> TrocarAdmin123!</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Sistema desenvolvido para gerenciamento da Copa Escolar Municipal</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

