import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Palette, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { useLanguage } from '../LanguageContext';

export default function BrandBuilder() {
  const { profile, updateProfile } = useAuth();
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    brandName: profile?.brandName || '',
    businessType: profile?.businessType || '',
    targetAudience: profile?.targetAudience || '',
    brandTone: profile?.brandTone || 'Professional',
    brandGoal: profile?.brandGoal || 'Brand Awareness',
    language: profile?.language || 'English',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      toast.success(t('saveBrand'));
    } catch (error) {
      console.error(error);
      toast.error('Error');
    } finally {
      setLoading(false);
    }
  };

  const tones = [
    { value: 'Professional', label: t('professional') },
    { value: 'Friendly', label: t('friendly') },
    { value: 'Witty', label: t('witty') },
    { value: 'Urgent', label: t('urgent') },
    { value: 'Educational', label: t('educational') },
  ];

  const goals = [
    { value: 'Brand Awareness', label: t('brandAwareness') },
    { value: 'Lead Generation', label: t('leadGeneration') },
    { value: 'Sales', label: t('sales') },
    { value: 'Engagement', label: t('engagement') },
  ];

  const languages = [
    { value: 'English', label: t('english') },
    { value: 'Spanish', label: t('spanish') },
    { value: 'French', label: t('french') },
    { value: 'German', label: t('german') },
    { value: 'Portuguese', label: t('portuguese') },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{t('brand')}</h1>
        <p className="text-gray-500 mt-1">{t('brandSub')}</p>
      </header>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('brandName')}</label>
              <input
                type="text"
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                placeholder={language === 'fr' ? "ex: Acme Corp" : "e.g. Acme Corp"}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('businessType')}</label>
              <input
                type="text"
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                placeholder={language === 'fr' ? "ex: Agence de marketing digital" : "e.g. Digital Marketing Agency"}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('targetAudience')}</label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                placeholder={language === 'fr' ? "ex: Propriétaires de petites entreprises" : "e.g. Small Business Owners"}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('tone')}</label>
              <select
                value={formData.brandTone}
                onChange={(e) => setFormData({ ...formData, brandTone: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                {tones.map(tone => <option key={tone.value} value={tone.value}>{tone.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('primaryGoal')}</label>
              <select
                value={formData.brandGoal}
                onChange={(e) => setFormData({ ...formData, brandGoal: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                {goals.map(goal => <option key={goal.value} value={goal.value}>{goal.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('language')}</label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                {languages.map(lang => <option key={lang.value} value={lang.value}>{lang.label}</option>)}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {t('saveBrand')}
          </button>
        </form>
      </div>

      <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 flex items-start gap-4">
        <div className="bg-blue-600 p-2 rounded-xl text-white">
          <Palette className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-blue-900 font-bold">{t('whyProfile')}</h3>
          <p className="text-blue-700 text-sm mt-1">
            {t('whyProfileSub')}
          </p>
        </div>
      </div>
    </div>
  );
}
