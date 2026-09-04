import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Article } from '../types';
import { formatDate } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const q = query(
          collection(db, 'articles'),
          where('slug', '==', slug),
          where('status', '==', 'published'),
          limit(1)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setArticle({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Article);
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Artigo não encontrado</h1>
        <Link to="/blog" className="text-blue-600 font-bold flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" /> Voltar para o Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header */}
      <div className="relative h-[50vh] min-h-[400px] bg-neutral-900 overflow-hidden">
        {article.coverImage && (
          <img 
            src={article.coverImage} 
            alt={article.title} 
            className="w-full h-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-8 lg:p-20">
          <div className="max-w-4xl mx-auto">
            <Link to="/blog" className="inline-flex items-center gap-2 text-blue-400 font-bold mb-6 hover:text-blue-300 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Blog
            </Link>
            <span className="block text-blue-400 font-bold uppercase tracking-widest text-xs mb-4">
              {article.category}
            </span>
            <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {article.title}
            </h1>
            <div className="flex items-center gap-6 text-neutral-300 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(article.createdAt)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="prose prose-lg lg:prose-xl max-w-none prose-blue">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </div>
        
        <div className="mt-16 pt-8 border-t border-neutral-100 flex justify-between items-center">
          <div className="flex gap-4">
            <button className="flex items-center gap-2 text-sm font-bold text-neutral-600 hover:text-blue-600 transition-colors">
              <Share2 className="w-5 h-5" /> Compartilhar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
