
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { BookOpen, User, Search, BarChart3, LogOut, Shield, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/dashboard';
    return user.role === 'admin' ? '/admin' : '/dashboard';
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-gray-900">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span>SkillSwap</span>
          </Link>
          
          {user && (
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                to="/browse" 
                className={`flex items-center space-x-1 hover:text-blue-600 transition-colors ${
                  isActive('/browse') ? 'text-blue-600 font-medium' : 'text-gray-700'
                }`}
              >
                <Search className="h-4 w-4" />
                <span>Browse Skills</span>
              </Link>
              <Link 
                to="/profile" 
                className={`flex items-center space-x-1 hover:text-blue-600 transition-colors ${
                  isActive('/profile') ? 'text-blue-600 font-medium' : 'text-gray-700'
                }`}
              >
                <User className="h-4 w-4" />
                <span>My Profile</span>
              </Link>
              <Link 
                to={getDashboardPath()}
                className={`flex items-center space-x-1 hover:text-blue-600 transition-colors ${
                  isActive('/dashboard') || isActive('/admin') ? 'text-blue-600 font-medium' : 'text-gray-700'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>{user.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}</span>
              </Link>
            </nav>
          )}

          <div className="flex items-center space-x-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(getDashboardPath())}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>{user.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}</span>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Admin Panel</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/login">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
