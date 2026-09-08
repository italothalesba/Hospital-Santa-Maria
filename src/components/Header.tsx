import { Link } from 'react-router-dom';
import { Phone, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { HOSPITAL_DATA } from '../data';
import { cn, getGoogleDriveDirectLink } from '../lib/utils';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { SiteSettings } from '../types';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>({
    logoUrl: HOSPITAL_DATA.logoUrl,
    whatsappNumber: HOSPITAL_DATA.whatsapp,
    whatsappFormatted: HOSPITAL_DATA.whatsappFormatted,
    address: HOSPITAL_DATA.address,
    heroTitle: '',
    heroSubtitle: '',
    heroImage: '',
    contactEmail: '',
    yearsOfCredibility: 28
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'global'));
        if (docSnap.exists()) {
          setSettings(docSnap.data() as SiteSettings);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src={getGoogleDriveDirectLink(settings.logoUrl)} 
              alt={HOSPITAL_DATA.name} 
              className="h-10 sm:h-12 w-auto object-contain"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logo.png';
              }}
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="relative text-sm font-semibold text-neutral-600 hover:text-blue-600 transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:rounded-full after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full">Início</Link>
            <a href="#especialidades" className="relative text-sm font-semibold text-neutral-600 hover:text-blue-600 transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:rounded-full after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full">Especialidades</a>
            <a href="#estrutura" className="relative text-sm font-semibold text-neutral-600 hover:text-blue-600 transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:rounded-full after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full">Estrutura</a>
            <Link to="/blog" className="relative text-sm font-semibold text-neutral-600 hover:text-blue-600 transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:rounded-full after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full">Blog</Link>
            <a 
              href={`https://wa.me/${settings.whatsappNumber}`}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              <Phone className="w-4 h-4" />
              {settings.whatsappFormatted}
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <a 
              href={`https://wa.me/${settings.whatsappNumber}`}
              className="md:hidden bg-blue-600 text-white p-2.5 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              aria-label="Agendar via WhatsApp"
            >
              <Phone className="w-5 h-5" />
            </a>
            <button 
              className="md:hidden p-2 -mr-2 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden absolute w-full bg-white border-b shadow-xl transition-all duration-300 overflow-hidden",
        isOpen ? "max-h-[80vh] overflow-y-auto py-4" : "max-h-0"
      )}>
        <div className="px-4 flex flex-col gap-3">
          <Link to="/" onClick={() => setIsOpen(false)} className="py-3 px-4 rounded-xl text-lg font-semibold text-neutral-800 hover:bg-neutral-50 hover:text-blue-600 transition-colors">Início</Link>
          <a href="#especialidades" onClick={() => setIsOpen(false)} className="py-3 px-4 rounded-xl text-lg font-semibold text-neutral-800 hover:bg-neutral-50 hover:text-blue-600 transition-colors">Especialidades</a>
          <a href="#estrutura" onClick={() => setIsOpen(false)} className="py-3 px-4 rounded-xl text-lg font-semibold text-neutral-800 hover:bg-neutral-50 hover:text-blue-600 transition-colors">Estrutura</a>
          <Link to="/blog" onClick={() => setIsOpen(false)} className="py-3 px-4 rounded-xl text-lg font-semibold text-neutral-800 hover:bg-neutral-50 hover:text-blue-600 transition-colors">Blog</Link>
          <a 
            href={`https://wa.me/${settings.whatsappNumber}`}
            className="mt-2 bg-blue-600 text-white px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            <Phone className="w-5 h-5" />
            Agendar Agora
          </a>
        </div>
      </div>
    </header>
  );
}
