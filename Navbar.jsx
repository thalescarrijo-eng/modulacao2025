import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Trophy, 
  Calendar, 
  BarChart3, 
  School, 
  LogOut, 
  User,
  Settings
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated, isVisitor, isTeacher, isAdmin } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const NavLink = ({ to, children, icon: Icon }) => (
    <Link to={to}>
      <Button 
        variant={isActive(to) ? "default" : "ghost"} 
        className="flex items-center gap-2"
      >
        {Icon && <Icon size={16} />}
        {children}
      </Button>
    </Link>
  );

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main navigation */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 mr-8">
              <Trophy className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                Copa Escolar Municipal
              </span>
            </Link>

            {/* Public navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <NavLink to="/competicoes" icon={Trophy}>
                Competições
              </NavLink>
              <NavLink to="/jogos" icon={Calendar}>
                Jogos
              </NavLink>
              <NavLink to="/resultados" icon={BarChart3}>
                Resultados
              </NavLink>
              <NavLink to="/classificacao" icon={BarChart3}>
                Classificação
              </NavLink>
              <NavLink to="/escolas" icon={School}>
                Escolas
              </NavLink>
            </div>
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated() ? (
              <>
                {/* Teacher specific navigation */}
                {isTeacher() && (
                  <div className="hidden md:flex items-center space-x-2">
                    <NavLink to="/meus-times">
                      Meus Times
                    </NavLink>
                    <NavLink to="/meus-jogos">
                      Meus Jogos
                    </NavLink>
                  </div>
                )}

                {/* Admin specific navigation */}
                {isAdmin() && (
                  <div className="hidden md:flex items-center space-x-2">
                    <NavLink to="/admin" icon={Settings}>
                      Administração
                    </NavLink>
                  </div>
                )}

                {/* User info and logout */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User size={16} />
                    <span>
                      {user?.nome || user?.username}
                      {user?.role && (
                        <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {user.role === 'VISITANTE' ? 'Visitante' : 
                           user.role === 'PROFESSOR' ? 'Professor' : 'Admin'}
                        </span>
                      )}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    className="flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Sair
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline">
                    Entrar
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden pb-3 pt-2 border-t">
          <div className="flex flex-wrap gap-2">
            <NavLink to="/competicoes">Competições</NavLink>
            <NavLink to="/jogos">Jogos</NavLink>
            <NavLink to="/resultados">Resultados</NavLink>
            <NavLink to="/classificacao">Classificação</NavLink>
            <NavLink to="/escolas">Escolas</NavLink>
            
            {isTeacher() && (
              <>
                <NavLink to="/meus-times">Meus Times</NavLink>
                <NavLink to="/meus-jogos">Meus Jogos</NavLink>
              </>
            )}
            
            {isAdmin() && (
              <NavLink to="/admin">Administração</NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

