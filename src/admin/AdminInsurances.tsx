import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Insurance } from '../types';
import { Plus, Edit2, Trash2, X, Save, ShieldCheck } from 'lucide-react';
import { getGoogleDriveDirectLink } from '../lib/utils';

export default function AdminInsurances() {
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentInsurance, setCurrentInsurance] = useState<Partial<Insurance> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsurances();
  }, []);

  const fetchInsurances = async () => {
    setLoading(true);
    const q = query(collection(db, 'insurances'), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    setInsurances(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Insurance)));
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInsurance?.name || !currentInsurance?.logoUrl) return;

    const insuranceData = {
      ...currentInsurance,
      order: currentInsurance.order || insurances.length + 1,
    };

    try {
      if (currentInsurance.id) {
        await updateDoc(doc(db, 'insurances', currentInsurance.id), insuranceData);
      } else {
        await addDoc(collection(db, 'insurances'), insuranceData);
      }
      setIsEditing(false);
      fetchInsurances();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar convênio.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja realmente excluir este convênio?')) {
      await deleteDoc(doc(db, 'insurances', id));
      fetchInsurances();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Convênios</h1>
          <p className="text-neutral-500 mt-1">Gerencie os planos de saúde e parceiros aceitos.</p>
        </div>
        <button 
          onClick={() => {
            setCurrentInsurance({ order: insurances.length + 1 });
            setIsEditing(true);
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          <Plus className="w-5 h-5" /> Novo Convênio
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 text-xs font-bold uppercase tracking-wider">
              <th className="px-8 py-5">Logo</th>
              <th className="px-8 py-5">Nome do Convênio</th>
              <th className="px-8 py-5">Ordem</th>
              <th className="px-8 py-5 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {insurances.map((insurance) => (
              <tr key={insurance.id} className="hover:bg-neutral-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <div className="w-16 h-10 bg-neutral-100 rounded-lg overflow-hidden flex items-center justify-center p-2">
                    <img 
                      src={getGoogleDriveDirectLink(insurance.logoUrl)} 
                      alt={insurance.name}
                      className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x50?text=Logo';
                      }}
                    />
                  </div>
                </td>
                <td className="px-8 py-5 text-sm font-bold text-neutral-900">{insurance.name}</td>
                <td className="px-8 py-5 text-sm text-neutral-500">{insurance.order}</td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => {
                        setCurrentInsurance(insurance);
                        setIsEditing(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => insurance.id && handleDelete(insurance.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl flex flex-col overflow-hidden">
            <header className="px-10 py-6 border-b border-neutral-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-neutral-900">
                {currentInsurance?.id ? 'Editar Convênio' : 'Novo Convênio'}
              </h2>
              <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-neutral-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </header>

            <form onSubmit={handleSave} className="p-10 space-y-6">
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Nome do Convênio</label>
                <input 
                  type="text" 
                  value={currentInsurance?.name || ''}
                  onChange={(e) => setCurrentInsurance({ ...currentInsurance, name: e.target.value })}
                  className="w-full px-5 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-blue-600 transition-all font-bold"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">URL da Logo (Google Drive aceito)</label>
                <input 
                  type="text" 
                  value={currentInsurance?.logoUrl || ''}
                  onChange={(e) => setCurrentInsurance({ ...currentInsurance, logoUrl: e.target.value })}
                  className="w-full px-5 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-blue-600 transition-all font-mono text-xs"
                  placeholder="Cole o link do Google Drive da logo em PNG"
                  required
                />
                <p className="mt-2 text-xs text-neutral-400">Dica: Use logos em PNG com fundo transparente para melhor resultado.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Ordem de Exibição</label>
                <input 
                  type="number" 
                  value={currentInsurance?.order || ''}
                  onChange={(e) => setCurrentInsurance({ ...currentInsurance, order: parseInt(e.target.value) })}
                  className="w-full px-5 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-blue-600 transition-all"
                />
              </div>

              <footer className="pt-6 border-t border-neutral-100 flex justify-end gap-4">
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-8 py-3 rounded-xl font-bold text-neutral-500 hover:bg-neutral-50 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-blue-600 text-white px-10 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
                >
                  <Save className="w-5 h-5" /> Salvar Convênio
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
