import { useState, useEffect } from 'react';
import { collection, getDocs, query, limit, orderBy, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { FileText, Users, Eye, TrendingUp, Sparkles } from 'lucide-react';
import { formatDate } from '../lib/utils';
import { Article } from '../types';
import { HOSPITAL_DATA } from '../data';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ articles: 0, published: 0, specialists: 0 });
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const articlesSnap = await getDocs(collection(db, 'articles'));
      const specialistsSnap = await getDocs(collection(db, 'specialists'));
      const articles = articlesSnap.docs.map(d => d.data());
      
      setStats({
        articles: articles.length,
        published: articles.filter(a => a.status === 'published').length,
        specialists: specialistsSnap.size
      });

      const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'), limit(5));
      const recentSnap = await getDocs(q);
      setRecentArticles(recentSnap.docs.map(d => ({ id: d.id, ...d.data() } as Article)));
    };
    fetchData();
  }, []);

  const seedNewSpecialists = async () => {
    setSeeding(true);
    try {
      // Find the two specific ones added to code
      const newSpecs = HOSPITAL_DATA.specialists.filter(s => 
        s.image.includes('1cWhxiL9') || s.image.includes('1Nm6ytk')
      );

      for (const spec of newSpecs) {
        await addDoc(collection(db, 'specialists'), {
          ...spec,
          order: stats.specialists + 1
        });
      }
      alert('Novos especialistas importados com sucesso!');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Erro ao importar especialistas.');
    } finally {
      setSeeding(false);
    }
  };

  const cards = [
    { label: 'Total de Artigos', value: stats.articles, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Artigos Publicados', value: stats.published, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Especialistas', value: stats.specialists, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Visualizações (Mock)', value: '1.2k', icon: Eye, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Visão Geral</h1>
        <button 
          onClick={seedNewSpecialists}
          disabled={seeding}
          className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50 w-full sm:w-auto"
        >
          <Sparkles className="w-5 h-5" /> Importar Novos Especialistas
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-100 shadow-sm">
            <div className={`w-12 h-12 ${card.bg} ${card.color} rounded-xl flex items-center justify-center mb-6`}>
              <card.icon className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-neutral-500 mb-1">{card.label}</p>
            <h3 className="text-3xl font-black text-neutral-900">{card.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-neutral-100 p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">Artigos Recentes</h2>
          <div className="space-y-6">
            {recentArticles.length > 0 ? recentArticles.map((article) => (
              <div key={article.id} className="flex items-center justify-between gap-3 py-4 border-b border-neutral-50 last:border-0">
                <div className="min-w-0">
                  <h4 className="font-bold text-neutral-900 truncate">{article.title}</h4>
                  <p className="text-xs text-neutral-500 mt-1">Postado em {formatDate(article.createdAt)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase shrink-0 ${
                  article.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'
                }`}>
                  {article.status === 'published' ? 'Publicado' : 'Rascunho'}
                </span>
              </div>
            )) : (
              <p className="text-neutral-500 text-sm">Nenhuma atividade recente.</p>
            )}
          </div>
        </div>

        <div className="bg-blue-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-100 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-4">Dica de SEO</h2>
            <p className="text-blue-100 text-sm leading-relaxed">
              Mantenha seu blog atualizado com artigos focados em termos regionais como 
              "Hospital em Juazeiro do Norte" ou "Especialista em Coluna no Cariri" 
              para melhorar seu posicionamento no Google.
            </p>
          </div>
          <div className="mt-8 pt-8 border-t border-blue-500">
            <button className="bg-white text-blue-600 w-full py-4 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
              Gerar ideias com IA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
