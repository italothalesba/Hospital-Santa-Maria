import { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { LayoutDashboard, FileText, Settings, LogOut, Users, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AdminLayout() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/admin/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  if (loading) return null;

  const menuItems = [
    { label: 'Visão Geral', path: '/admin', icon: LayoutDashboard },
    { label: 'Artigos', path: '/admin/articles', icon: FileText },
    { label: 'Especialistas', path: '/admin/specialists', icon: Users },
    { label: 'Convênios', path: '/admin/insurances', icon: ShieldCheck },
    { label: 'Configurações', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside className="w-72 bg-neutral-900 text-white flex flex-col fixed inset-y-0">
        <div className="p-8 border-b border-neutral-800">
          <h2 className="text-xl font-bold tracking-tight">Santa Maria <span className="text-blue-500">Admin</span></h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                  isActive ? "bg-blue-600 text-white" : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-800">
          <button 
            onClick={() => signOut(auth)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sair do Painel
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-10">
        <Outlet />
      </main>
    </div>
  );
}
