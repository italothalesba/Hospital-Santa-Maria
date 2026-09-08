import { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { LayoutDashboard, FileText, Settings, LogOut, Users, ShieldCheck, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';

const menuItems = [
  { label: 'Visão Geral', path: '/admin', icon: LayoutDashboard },
  { label: 'Artigos', path: '/admin/articles', icon: FileText },
  { label: 'Especialistas', path: '/admin/specialists', icon: Users },
  { label: 'Convênios', path: '/admin/insurances', icon: ShieldCheck },
  { label: 'Configurações', path: '/admin/settings', icon: Settings },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();

  return (
    <>
      <div className="p-6 sm:p-8 border-b border-neutral-800">
        <h2 className="text-xl font-bold tracking-tight">Santa Maria <span className="text-blue-500">Admin</span></h2>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "text-neutral-400 hover:text-white hover:bg-neutral-800"
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
    </>
  );
}

export default function AdminLayout() {
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
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

  // Fecha o drawer ao trocar de rota
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  if (loading) return null;

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Mobile Top Bar */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-40 bg-neutral-900 text-white flex items-center justify-between px-4 sm:px-6 h-16 shadow-lg">
        <h2 className="text-lg font-bold tracking-tight">Santa Maria <span className="text-blue-500">Admin</span></h2>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg hover:bg-neutral-800 transition-colors"
          aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Sidebar (Drawer) */}
      <aside
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-neutral-900 text-white flex flex-col transition-transform duration-300 shadow-2xl",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarNav onNavigate={() => setMobileOpen(false)} />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 bg-neutral-900 text-white flex-col fixed inset-y-0">
        <SidebarNav />
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 p-6 sm:p-8 lg:p-10 pt-24 lg:pt-10 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
