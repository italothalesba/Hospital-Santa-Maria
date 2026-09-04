import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Article } from '../types';
import { Link } from 'react-router-dom';
import { formatDate } from '../lib/utils';
import { ArrowRight, Calendar, User } from 'lucide-react';

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const q = query(
          collection(db, 'articles'),
          where('status', '==', 'published'),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
        setArticles(docs);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <div className="py-20 bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-16 text-center">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Blog Hospital Santa Maria</h1>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Dicas de saúde, novidades tecnológicas e informações para o bem-estar da sua família no Cariri.
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : articles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article key={article.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-neutral-100 flex flex-col">
                <div className="aspect-video bg-neutral-200">
                  {article.coverImage && (
                    <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-xs font-bold text-blue-600 uppercase mb-4">
                    <span>{article.category}</span>
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900 mb-3 leading-tight">
                    <Link to={`/blog/${article.slug}`} className="hover:text-blue-600 transition-colors">
                      {article.title}
                    </Link>
                  </h2>
                  <p className="text-neutral-600 text-sm mb-6 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="mt-auto pt-6 border-t border-neutral-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(article.createdAt)}
                    </div>
                    <Link to={`/blog/${article.slug}`} className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                      Ler mais <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-neutral-200">
            <p className="text-neutral-500">Nenhum artigo publicado ainda. Em breve novidades!</p>
          </div>
        )}
      </div>
    </div>
  );
}
