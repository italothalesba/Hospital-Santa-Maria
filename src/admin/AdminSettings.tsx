import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SiteSettings } from '../types';
import { Save, Globe, Phone, MapPin, Mail, Image as ImageIcon } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings>({
    logoUrl: 'https://drive.google.com/file/d/1ZmBqUD9eARkqgO7FMnHtN3KhTiYIRBag/view?usp=sharing',
    whatsappNumber: '5588988425694',
    whatsappFormatted: '(88) 9 8842-5694',
    address: 'Rua Conceição, 878 - Centro, Juazeiro do Norte - CE',
    heroTitle: 'Consultórios equipados e prontos para atender você!',
    heroSubtitle: 'Descubra mais sobre nossos serviços e especialidades. Tecnologia avançada e cuidado humano para sua família.',
    heroImage: '',
    contactEmail: 'contato@hospitalsantamaria.com.br',
    yearsOfCredibility: 28
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const docRef = doc(db, 'settings', 'global');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings(docSnap.data() as SiteSettings);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'global'), settings);
      alert('Configurações salvas com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <div className="max-w-4xl">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-neutral-900">Configurações do Site</h1>
        <p className="text-neutral-500 mt-1">Gerencie a identidade visual e contatos do hospital.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="bg-white rounded-[32px] border border-neutral-200 p-10 shadow-sm space-y-8">
          <h2 className="text-xl font-bold text-neutral-900 border-b border-neutral-100 pb-4">Identidade & Banners</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-neutral-700 mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-500" /> URL do Logo (Google Drive aceito)
              </label>
              <input 
                type="text" 
                value={settings.logoUrl}
                onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                className="w-full px-5 py-4 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-blue-600 transition-all font-mono text-xs"
                placeholder="https://drive.google.com/..."
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-bold text-neutral-700 mb-2">Título do Hero (Banner Principal)</label>
              <input 
                type="text" 
                value={settings.heroTitle}
                onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                className="w-full px-5 py-4 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-blue-600 transition-all font-bold text-xl"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-bold text-neutral-700 mb-2">Subtítulo do Hero</label>
              <textarea 
                rows={2}
                value={settings.heroSubtitle}
                onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                className="w-full px-5 py-4 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-blue-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-500" /> Imagem de Capa (URL)
              </label>
              <input 
                type="text" 
                value={settings.heroImage}
                onChange={(e) => setSettings({ ...settings, heroImage: e.target.value })}
                className="w-full px-5 py-4 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-blue-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Anos de Credibilidade</label>
              <input 
                type="number" 
                value={settings.yearsOfCredibility}
                onChange={(e) => setSettings({ ...settings, yearsOfCredibility: parseInt(e.target.value) })}
                className="w-full px-5 py-4 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-blue-600 transition-all font-bold"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[32px] border border-neutral-200 p-10 shadow-sm space-y-8">
          <h2 className="text-xl font-bold text-neutral-900 border-b border-neutral-100 pb-4">Contatos & Localização</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-500" /> WhatsApp (Números apenas)
              </label>
              <input 
                type="text" 
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full px-5 py-4 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-blue-600 transition-all"
                placeholder="Ex: 5588988425694"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-500" /> WhatsApp (Formatado para exibir)
              </label>
              <input 
                type="text" 
                value={settings.whatsappFormatted}
                onChange={(e) => setSettings({ ...settings, whatsappFormatted: e.target.value })}
                className="w-full px-5 py-4 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-blue-600 transition-all"
                placeholder="Ex: (88) 9 8842-5694"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500" /> Endereço Completo
            </label>
            <input 
              type="text" 
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-5 py-4 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-blue-600 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-500" /> E-mail de Contato
            </label>
            <input 
              type="email" 
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              className="w-full px-5 py-4 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-blue-600 transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            disabled={saving}
            className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 disabled:opacity-50 flex items-center gap-3"
          >
            <Save className="w-6 h-6" /> {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}
