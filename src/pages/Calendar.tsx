import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy, addDoc } from 'firebase/firestore';
import { GeneratedContent } from '../types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { generateWeeklyPlanner } from '../services/ai';

import { useLanguage } from '../LanguageContext';

export default function Calendar() {
  const { user, profile } = useAuth();
  const { t, language } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [contents, setContents] = useState<GeneratedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingWeekly, setGeneratingWeekly] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'users', user.uid, 'content'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GeneratedContent));
      setContents(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const handleGenerateWeekly = async () => {
    if (!user || !profile) return;
    setGeneratingWeekly(true);
    try {
      const langName = language === 'fr' ? 'French' : 'English';
      const plan = await generateWeeklyPlanner(profile, langName);
      
      const promises = plan.map((item: any, index: number) => {
        const scheduledDate = new Date();
        scheduledDate.setDate(scheduledDate.getDate() + index + 1);
        
        return addDoc(collection(db, 'users', user.uid, 'content'), {
          title: item.topic,
          content: item.topic,
          type: item.type,
          cta: '',
          hashtags: [],
          createdAt: new Date().toISOString(),
          scheduledDate: scheduledDate.toISOString(),
          status: 'scheduled'
        });
      });

      await Promise.all(promises);
      toast.success(language === 'fr' ? 'Plan hebdomadaire généré !' : 'Weekly plan generated!');
    } catch (error) {
      console.error(error);
      toast.error('Error');
    } finally {
      setGeneratingWeekly(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{t('calendar')}</h1>
          <p className="text-gray-500 mt-1">{t('calendarSub')}</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-sm font-bold text-gray-900 min-w-[120px] text-center">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest border-r border-gray-50 last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {/* Add empty cells for padding start of month */}
          {Array.from({ length: monthStart.getDay() }).map((_, i) => (
            <div key={`empty-${i}`} className="h-32 border-r border-b border-gray-50 bg-gray-50/30"></div>
          ))}
          
          {days.map((day) => {
            const dayContent = contents.filter(c => c.scheduledDate && isSameDay(new Date(c.scheduledDate), day));
            const isToday = isSameDay(day, new Date());

            return (
              <div key={day.toString()} className="h-32 border-r border-b border-gray-50 p-2 relative group hover:bg-gray-50 transition-colors last:border-r-0">
                <span className={cn(
                  "text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full transition-colors",
                  isToday ? "bg-blue-600 text-white" : "text-gray-400"
                )}>
                  {format(day, 'd')}
                </span>
                
                <div className="mt-1 space-y-1 overflow-y-auto max-h-[80px] scrollbar-hide">
                  {dayContent.map(item => (
                    <div key={item.id} className="bg-blue-50 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-blue-100 truncate">
                      {item.type}: {item.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            {t('unscheduled')}
          </h2>
          <div className="space-y-4">
            {contents.filter(c => !c.scheduledDate).slice(0, 5).map(item => (
              <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-blue-200 transition-all">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                  <p className="text-xs text-gray-500">{item.type} • {format(new Date(item.createdAt), 'MMM d')}</p>
                </div>
                <button className="text-xs font-bold text-blue-600 hover:underline">{t('schedule')}</button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 p-8 rounded-3xl text-white shadow-xl">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-400" />
            {t('weeklyPlanner')}
          </h2>
          <p className="text-gray-400 text-sm mb-6">{t('weeklyPlannerSub')}</p>
          <button 
            onClick={handleGenerateWeekly}
            disabled={generatingWeekly}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {generatingWeekly ? <Loader2 className="w-5 h-5 animate-spin" /> : <CalendarIcon className="w-5 h-5" />}
            {t('generateWeekly')}
          </button>
        </div>
      </div>
    </div>
  );
}
