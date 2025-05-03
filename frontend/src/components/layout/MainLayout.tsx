
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PieChart, 
  LineChart, 
  History, 
  Settings, 
  Menu, 
  X, 
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Protect routes - redirect to login if not authenticated
  useEffect(() => {
    if (isMounted && !user && !location.pathname.startsWith('/auth')) {
      navigate('/auth/login');
    }
  }, [user, location.pathname, navigate, isMounted]);

  // If not authenticated and not on an auth page, don't render anything until redirect happens
  if (!user && !location.pathname.startsWith('/auth')) {
    return null;
  }

  // If on auth page, render children without layout
  if (location.pathname.startsWith('/auth')) {
    return <>{children}</>;
  }

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: 'Portfolios',
      path: '/portfolios',
      icon: <PieChart className="h-5 w-5" />,
    },
    {
      name: 'Market',
      path: '/market',
      icon: <LineChart className="h-5 w-5" />,
    },
    {
      name: 'Transactions',
      path: '/transactions',
      icon: <History className="h-5 w-5" />,
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/') {
      return true;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-4 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-investsim-600 text-white p-1 rounded">
              <PieChart className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl">InvestSim</span>
          </Link>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - desktop */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="p-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-investsim-600 text-white p-1 rounded">
                <PieChart className="h-6 w-6" />
              </div>
              <span className="font-bold text-xl">InvestSim</span>
            </Link>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                      isActive(item.path)
                        ? "bg-investsim-50 dark:bg-investsim-900/20 text-investsim-600 dark:text-investsim-400 font-medium"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-investsim-100 flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="h-5 w-5 text-investsim-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user?.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "w-full gap-2"
              )}
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div 
              className="fixed inset-0 bg-black/50" 
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            <div className="relative bg-white dark:bg-gray-900 w-3/4 max-w-sm flex flex-col overflow-y-auto">
              <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <Link to="/" className="flex items-center gap-2">
                  <div className="bg-investsim-600 text-white p-1 rounded">
                    <PieChart className="h-5 w-5" />
                  </div>
                  <span className="font-bold text-lg">InvestSim</span>
                </Link>
              </div>

              <div className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-3">
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={cn(
                          "flex items-center gap-3 px-3 py-3 rounded-md transition-colors",
                          isActive(item.path)
                            ? "bg-investsim-50 dark:bg-investsim-900/20 text-investsim-600 dark:text-investsim-400 font-medium"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        )}
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-investsim-100 flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-5 w-5 text-investsim-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "w-full gap-2"
                  )}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
          <div className="container mx-auto py-6 px-4 md:px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
