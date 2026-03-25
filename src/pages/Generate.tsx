import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { generateMarketingContent } from '../services/ai';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ContentType, GenerationParams, GeneratedContent } from '../types';
import { Sparkles, Copy, Calendar, Edit, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

export default function Generate() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [copied, setCopied] = useState(false);

  const [params, setParams] = useState<GenerationParams>({
    type: 'Instagram',
    businessType: profile?.businessType || '',
    targetAudience: profile?.targetAudience || '',
    tone: profile?.brandTone || 'Professional',
    goal: profile?.brandGoal || 'Brand Awareness',
    language: profile?.language || 'English',
    length: 'medium',
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setResult(null);

    try {
      const aiResponse = await generateMarketingContent(params, profile);
      const newContent: GeneratedContent = {
        uid: user.uid,
        type: params.type,
        title: aiResponse.title,
        content: aiResponse.content,
        cta: aiResponse.cta,
        hashtags: aiResponse.hashtags,
        createdAt: new Date().toISOString(),
        status: 'draft',
      };

      const docRef = await addDoc(collection(db, 'users', user.uid, 'content'), newContent);
      setResult({ ...newContent, id: docRef.id });
      toast.success('Content generated successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `${result.title}\n\n${result.content}\n\n${result.cta}\n\n${result.hashtags?.join(' ')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard!');
  };

  const contentTypes: ContentType[] = [
    'Instagram', 'LinkedIn', 'Email', 'Blog', 'WhatsApp', 'Video Script', 'Sales Page', 'Product Description'
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Generate Content</h1>
        <p className="text-gray-500 mt-1">Fill in the details and let AI do the heavy lifting.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Content Type</label>
                <select
                  value={params.type}
                  onChange={(e) => setParams({ ...params, type: e.target.value as ContentType })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                >
                  {contentTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Business Type</label>
                <input
                  type="text"
                  value={params.businessType}
                  onChange={(e) => setParams({ ...params, businessType: e.target.value })}
                  placeholder="e.g. SaaS, Coffee Shop"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Target Audience</label>
                <input
                  type="text"
                  value={params.targetAudience}
                  onChange={(e) => setParams({ ...params, targetAudience: e.target.value })}
                  placeholder="e.g. Young Professionals"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tone</label>
                <select
                  value={params.tone}
                  onChange={(e) => setParams({ ...params, tone: e.target.value })}
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Goal</label>
                <select
                  value={params.goal}
                  onChange={(e) => setParams({ ...params, goal: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                >
                  <option>Brand Awareness</option>
                  <option>Lead Generation</option>
                  <option>Sales</option>
                  <option>Engagement</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Language</label>
                <select
                  value={params.language}
                  onChange={(e) => setParams({ ...params, language: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Portuguese</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Length</label>
                <select
                  value={params.length}
                  onChange={(e) => setParams({ ...params, length: e.target.value as any })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="short">Short</option>
                  <option value="medium">Medium</option>
                  <option value="long">Long</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate with AI
                </>
              )}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{result.type}</span>
                  <div className="flex gap-2">
                    <button onClick={handleCopy} className="p-2 hover:bg-gray-50 rounded-xl text-gray-500 transition-colors" title="Copy">
                      {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                    <button className="p-2 hover:bg-gray-50 rounded-xl text-gray-500 transition-colors" title="Edit">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-gray-50 rounded-xl text-gray-500 transition-colors" title="Schedule">
                      <Calendar className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <h2 className="text-xl font-bold text-gray-900">{result.title}</h2>
                  <div className="prose prose-sm text-gray-600 max-w-none whitespace-pre-wrap">
                    {result.content}
                  </div>
                  {result.cta && (
                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                      <p className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-1">Call to Action</p>
                      <p className="text-blue-700 font-medium">{result.cta}</p>
                    </div>
                  )}
                  {result.hashtags && result.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4">
                      {result.hashtags.map(tag => (
                        <span key={tag} className="text-blue-600 text-sm font-medium">#{tag.replace('#', '')}</span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl h-full flex flex-col items-center justify-center p-12 text-center">
                <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
                  <Sparkles className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Ready to create?</h3>
                <p className="text-gray-500 mt-2 max-w-xs">
                  Fill in the form and click generate to see the magic happen.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
