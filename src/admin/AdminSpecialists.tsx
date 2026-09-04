import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Specialist } from '../types';
import { Plus, Search, Edit2, Trash2, X, Save, User } from 'lucide-react';
import { getGoogleDriveDirectLink } from '../lib/utils';

export default function AdminSpecialists() {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSpecialist, setCurrentSpecialist] = useState<Partial<Specialist> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpecialists();
  }, []);

  const fetchSpecialists = async () => {
    setLoading(true);
    const q = query(collection(db, 'specialists'), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    setSpecialists(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Specialist)));
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSpecialist?.name || !currentSpecialist?.role || !currentSpecialist?.image) return;

    const specialistData = {
      ...currentSpecialist,
      order: currentSpecialist.order || specialists.length + 1,
    };

    try {
      if (currentSpecialist.id) {
        await updateDoc(doc(db, 'specialists', currentSpecialist.id), specialistData);
      } else {
        await addDoc(collection(db, 'specialists'), specialistData);
      }
      setIsEditing(false);
      fetchSpecialists();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar especialista.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja realmente excluir este especialista?')) {
      await deleteDoc(doc(db, 'specialists', id));
      fetchSpecialists();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Corpo Clínico</h1>
          <p className="text-neutral-500 mt-1">Gerencie os médicos e profissionais do hospital.</p>
        </div>
        <button 
          onClick={() => {
            setCurrentSpecialist({ order: specialists.length + 1 });
            setIsEditing(true);
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          <Plus className="w-5 h-5" /> Novo Especialista
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 text-xs font-bold uppercase tracking-wider">
              <th className="px-8 py-5">Nome</th>
              <th className="px-8 py-5">Especialidade</th>
              <th className="px-8 py-5">Registro</th>
              <th className="px-8 py-5">Ordem</th>
              <th className="px-8 py-5 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {specialists.map((specialist) => (
              <tr key={specialist.id} className="hover:bg-neutral-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-neutral-100 overflow-hidden flex-shrink-0">
                      <img 
                        src={getGoogleDriveDirectLink(specialist.image)} 
                        alt={specialist.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=Doc';
                        }}
                      />
                    </div>
                    <span className="font-bold text-neutral-900">{specialist.name}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-sm text-neutral-600 font-medium">{specialist.role}</td>
                <td className="px-8 py-5 text-sm text-neutral-500">
                  {specialist.crm || specialist.cremec || specialist.crn || '-'}
                </td>
                <td className="px-8 py-5 text-sm text-neutral-500">{specialist.order}</td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => {
                        setCurrentSpecialist(specialist);
                        setIsEditing(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => specialist.id && handleDelete(specialist.id)}
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
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden">
            <header className="px-10 py-6 border-b border-neutral-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-neutral-900">
                {currentSpecialist?.id ? 'Editar Especialista' : 'Novo Especialista'}
              </h2>
              <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-neutral-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </header>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Nome Completo</label>
                  <input 
                    type="text" 
                    value={currentSpecialist?.name || ''}
                    onChange={(e) => setCurrentSpecialist({ ...currentSpecialist, name: e.target.value })}
                    className="w-full px-5 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-blue-600 transition-all font-bold"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Especialidade / Papel</label>
                  <input 
                    type="text" 
                    value={currentSpecialist?.role || ''}
                    onChange={(e) => setCurrentSpecialist({ ...currentSpecialist, role: e.target.value })}
                    className="w-full px-5 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-blue-600 transition-all font-bold text-blue-600"
                    placeholder="Ex: Ortopedista e Traumatologista"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">CRM (Opcional)</label>
                  <input 
                    type="text" 
                    value={currentSpecialist?.crm || ''}
                    onChange={(e) => setCurrentSpecialist({ ...currentSpecialist, crm: e.target.value })}
                    className="w-full px-5 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-blue-600 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">CREMEC (Opcional)</label>
                  <input 
                    type="text" 
                    value={currentSpecialist?.cremec || ''}
                    onChange={(e) => setCurrentSpecialist({ ...currentSpecialist, cremec: e.target.value })}
                    className="w-full px-5 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-blue-600 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">CRN (Opcional)</label>
                  <input 
                    type="text" 
                    value={currentSpecialist?.crn || ''}
                    onChange={(e) => setCurrentSpecialist({ ...currentSpecialist, crn: e.target.value })}
                    className="w-full px-5 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-blue-600 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Ordem de Exibição</label>
                  <input 
                    type="number" 
                    value={currentSpecialist?.order || ''}
                    onChange={(e) => setCurrentSpecialist({ ...currentSpecialist, order: parseInt(e.target.value) })}
                    className="w-full px-5 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-blue-600 transition-all"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-neutral-700 mb-2">URL da Imagem (Google Drive aceito)</label>
                  <input 
                    type="text" 
                    value={currentSpecialist?.image || ''}
                    onChange={(e) => setCurrentSpecialist({ ...currentSpecialist, image: e.target.value })}
                    className="w-full px-5 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-blue-600 transition-all font-mono text-xs"
                    placeholder="Cole o link do Google Drive ou link direto"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Descrição / Bio</label>
                  <textarea 
                    rows={3}
                    value={currentSpecialist?.description || ''}
                    onChange={(e) => setCurrentSpecialist({ ...currentSpecialist, description: e.target.value })}
                    className="w-full px-5 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-blue-600 transition-all text-sm"
                    placeholder="Breve currículo ou descrição..."
                    required
                  />
                </div>
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
                  <Save className="w-5 h-5" /> Salvar Especialista
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
