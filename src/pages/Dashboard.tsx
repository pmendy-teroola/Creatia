import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';
import { GeneratedContent } from '../types';
import { PenTool, Calendar, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

import { useLanguage } from '../LanguageContext';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const [recentContent, setRecentContent] = useState<GeneratedContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'users', user.uid, 'content'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const content = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GeneratedContent));
      setRecentContent(content);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const stats = [
    { label: t('totalContent'), value: recentContent.length, icon: PenTool, color: 'bg-blue-500' },
    { label: t('scheduled'), value: 0, icon: Calendar, color: 'bg-purple-500' },
    { label: t('growth'), value: '+12%', icon: TrendingUp, color: 'bg-green-500' },
  ];

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{t('welcome')}, {profile?.displayName?.split(' ')[0]}</h1>
          <p className="text-gray-500 mt-1">{t('dashboardSub')}</p>
        </div>
        <Link 
          to="/generate"
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2"
        >
          <PenTool className="w-5 h-5" />
          {t('generate')}
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className={`${stat.color} p-3 rounded-2xl text-white`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">{t('recentContent')}</h2>
            <Link to="/calendar" className="text-blue-600 text-sm font-medium hover:underline">{t('viewAll')}</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {loading ? (
              <div className="p-12 text-center text-gray-400">Loading...</div>
            ) : recentContent.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-400">{t('noContent')}</p>
                <Link to="/generate" className="text-blue-600 font-medium mt-2 inline-block">{t('startCreating')}</Link>
              </div>
            ) : (
              recentContent.map((item) => (
                <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors group">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="bg-gray-100 p-2.5 rounded-xl text-gray-600 group-hover:bg-white transition-colors">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">{item.type}</span>
                          • {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-2">{t('aiSuggestions')}</h2>
            <p className="text-blue-100 text-sm mb-6">{t('aiSuggestionsSub')}</p>
            
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                <p className="text-sm font-medium">"{t('suggestion1').replace('{industry}', profile?.businessType || t('yourIndustry'))}"</p>
                <p className="text-xs text-blue-200 mt-2">{t('suggestion1Sub')}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                <p className="text-sm font-medium">"{t('suggestion2').replace('{brand}', profile?.brandName || t('yourBrand'))}"</p>
                <p className="text-xs text-blue-200 mt-2">{t('suggestion2Sub')}</p>
              </div>
            </div>

            <button className="mt-8 w-full bg-white text-blue-600 py-3 rounded-2xl font-bold hover:bg-blue-50 transition-colors">
              {t('generateNow')}
            </button>
          </div>
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}
