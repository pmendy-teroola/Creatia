import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Palette, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function BrandBuilder() {
  const { profile, updateProfile } = useAuth();
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
      toast.success('Brand profile updated!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Brand Builder</h1>
        <p className="text-gray-500 mt-1">Teach CreateAI about your brand to get better results.</p>
      </header>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Brand Name</label>
              <input
                type="text"
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                placeholder="e.g. Acme Corp"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Business Type</label>
              <input
                type="text"
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                placeholder="e.g. Digital Marketing Agency"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Target Audience</label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                placeholder="e.g. Small Business Owners"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Brand Tone</label>
              <select
                value={formData.brandTone}
                onChange={(e) => setFormData({ ...formData, brandTone: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                <option>Professional</option>
                <option>Friendly</option>
                <option>Witty</option>
                <option>Urgent</option>
                <option>Educational</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Goal</label>
              <select
                value={formData.brandGoal}
                onChange={(e) => setFormData({ ...formData, brandGoal: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                <option>Brand Awareness</option>
                <option>Lead Generation</option>
                <option>Sales</option>
                <option>Engagement</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Brand Profile
          </button>
        </form>
      </div>

      <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 flex items-start gap-4">
        <div className="bg-blue-600 p-2 rounded-xl text-white">
          <Palette className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-blue-900 font-bold">Why complete your profile?</h3>
          <p className="text-blue-700 text-sm mt-1">
            When your profile is complete, CreateAI uses this information as context for every generation. 
            This ensures your content is always consistent with your brand voice and goals.
          </p>
        </div>
      </div>
    </div>
  );
}
