import { HOSPITAL_DATA } from '../data';
import { MapPin, Phone, Globe, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { SiteSettings } from '../types';
import { getGoogleDriveDirectLink } from '../lib/utils';

export default function Footer() {
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
    <footer className="bg-neutral-900 text-neutral-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <img 
              src={getGoogleDriveDirectLink(settings.logoUrl)} 
              alt={HOSPITAL_DATA.name} 
              className="h-16 w-auto object-contain brightness-0 invert mb-6"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logo.png';
              }}
            />
            <p className="max-w-md mb-8 leading-relaxed">
              {HOSPITAL_DATA.history} Sua vida é nossa prioridade no Cariri.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-neutral-800 rounded-lg hover:bg-blue-600 transition-colors"><Globe className="w-5 h-5" /></a>
              <a href="#" className="p-2 bg-neutral-800 rounded-lg hover:bg-blue-600 transition-colors"><Share2 className="w-5 h-5" /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Contato</h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="text-sm">{settings.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="text-sm">{settings.whatsappFormatted}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Institucional</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Sobre Nós</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Corpo Clínico</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Convênios</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 mt-16 pt-8 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} Hospital Santa Maria. Todos os direitos reservados. Juazeiro do Norte - CE.</p>
        </div>
      </div>
    </footer>
  );
}
