import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Article } from '../types';
import { Plus, Search, Edit2, Trash2, X, Save, Eye } from 'lucide-react';
import { formatDate, cn, getGoogleDriveDirectLink } from '../lib/utils';

export default function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Partial<Article> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    setArticles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article)));
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentArticle?.title || !currentArticle?.slug || !currentArticle?.content) return;

    const articleData = {
      ...currentArticle,
      updatedAt: Timestamp.now(),
      createdAt: currentArticle.createdAt || Timestamp.now(),
    };

    try {
      if (currentArticle.id) {
        await updateDoc(doc(db, 'articles', currentArticle.id), articleData);
      } else {
        await addDoc(collection(db, 'articles'), articleData);
      }
      setIsEditing(false);
      fetchArticles();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar artigo.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja realmente excluir este artigo?')) {
      await deleteDoc(doc(db, 'articles', id));
      fetchArticles();
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w ]+/g, '').replace(/ +/g, '-');
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Gerenciar Artigos</h1>
          <p className="text-neutral-500 mt-1">Crie e edite conteúdos para o blog do hospital.</p>
        </div>
        <button 
          onClick={() => {
            setCurrentArticle({ status: 'draft', category: 'Saúde' });
            setIsEditing(true);
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" /> Novo Artigo
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 text-xs font-bold uppercase tracking-wider">
              <th className="px-8 py-5">Título</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5">Categoria</th>
              <th className="px-8 py-5">Data</th>
              <th className="px-8 py-5 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-neutral-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-neutral-100 overflow-hidden shrink-0">
                      <img 
                        src={getGoogleDriveDirectLink(article.coverImage)} 
                        alt={article.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100';
                        }}
                      />
                    </div>
                    <div>
                      <span className="font-bold text-neutral-900 block">{article.title}</span>
                      <span className="text-xs text-neutral-400">/{article.slug}</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                    article.status === 'published' ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"
                  )}>
                    {article.status === 'published' ? 'Publicado' : 'Rascunho'}
                  </span>
                </td>
                <td className="px-8 py-5 text-sm text-neutral-600 font-medium">{article.category}</td>
                <td className="px-8 py-5 text-sm text-neutral-500">{formatDate(article.createdAt)}</td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => {
                        setCurrentArticle(article);
                        setIsEditing(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(article.id)}
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

      {/* Editor Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden">
            <header className="px-6 sm:px-10 py-5 sm:py-6 border-b border-neutral-100 flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
                {currentArticle?.id ? 'Editar Artigo' : 'Novo Artigo'}
              </h2>
              <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-neutral-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </header>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-2">Título do Artigo</label>
                    <input 
                      type="text" 
                      value={currentArticle?.title || ''}
                      onChange={(e) => {
                        const title = e.target.value;
                        setCurrentArticle({ ...currentArticle, title, slug: currentArticle?.id ? currentArticle.slug : generateSlug(title) });
                      }}
                      className="w-full px-5 py-4 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-blue-600 transition-all font-bold text-lg"
                      placeholder="Ex: Prevenção do Câncer de Cólon..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-2">Slug (URL)</label>
                    <input 
                      type="text" 
                      value={currentArticle?.slug || ''}
                      onChange={(e) => setCurrentArticle({ ...currentArticle, slug: e.target.value })}
                      className="w-full px-5 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-500 font-mono text-xs"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-2">Categoria</label>
                    <select 
                      value={currentArticle?.category || 'Saúde'}
                      onChange={(e) => setCurrentArticle({ ...currentArticle, category: e.target.value as any })}
                      className="w-full px-5 py-4 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-blue-600 transition-all"
                    >
                      <option>Saúde</option>
                      <option>Tecnologia</option>
                      <option>Especialidades</option>
                      <option>Institucional</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-2">Status de Publicação</label>
                    <select 
                      value={currentArticle?.status || 'draft'}
                      onChange={(e) => setCurrentArticle({ ...currentArticle, status: e.target.value as any })}
                      className="w-full px-5 py-4 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-blue-600 transition-all"
                    >
                      <option value="draft">Rascunho</option>
                      <option value="published">Publicado</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Resumo (Excerpt)</label>
                <textarea 
                  rows={2}
                  value={currentArticle?.excerpt || ''}
                  onChange={(e) => setCurrentArticle({ ...currentArticle, excerpt: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-blue-600 transition-all text-sm"
                  placeholder="Um breve resumo para aparecer na listagem..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">URL da Imagem de Capa</label>
                <input 
                  type="text" 
                  value={currentArticle?.coverImage || ''}
                  onChange={(e) => setCurrentArticle({ ...currentArticle, coverImage: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-blue-600 transition-all"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Conteúdo (Markdown)</label>
                <textarea 
                  rows={15}
                  value={currentArticle?.content || ''}
                  onChange={(e) => setCurrentArticle({ ...currentArticle, content: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl bg-neutral-50 border border-neutral-200 font-mono text-sm focus:border-blue-600 transition-all"
                  placeholder="Escreva seu artigo aqui usando Markdown..."
                  required
                />
              </div>

              <footer className="pt-8 border-t border-neutral-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-4">
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-8 py-3 rounded-xl font-bold text-neutral-500 hover:bg-neutral-50 transition-all w-full sm:w-auto"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-blue-600 text-white px-10 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 w-full sm:w-auto"
                >
                  <Save className="w-5 h-5" /> Salvar Artigo
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
