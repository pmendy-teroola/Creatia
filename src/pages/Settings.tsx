import { useAuth } from '../AuthContext';
import { User, Mail, Bell, Shield, CreditCard } from 'lucide-react';

export default function Settings() {
  const { profile } = useAuth();

  const sections = [
    { title: 'Account', icon: User, description: 'Manage your personal information and profile.' },
    { title: 'Notifications', icon: Bell, description: 'Configure how you receive alerts and updates.' },
    { title: 'Security', icon: Shield, description: 'Update your password and security settings.' },
    { title: 'Billing', icon: CreditCard, description: 'Manage your subscription and payment methods.' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and preferences.</p>
      </header>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center gap-6">
          <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 text-2xl font-bold">
            {profile?.displayName?.[0] || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{profile?.displayName}</h2>
            <p className="text-gray-500 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {profile?.email}
            </p>
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {sections.map((section) => (
            <button key={section.title} className="w-full p-6 flex items-center gap-6 hover:bg-gray-50 transition-colors text-left group">
              <div className="bg-gray-100 p-3 rounded-2xl text-gray-600 group-hover:bg-white transition-colors">
                <section.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{section.title}</h3>
                <p className="text-sm text-gray-500">{section.description}</p>
              </div>
              <div className="text-gray-300 group-hover:text-gray-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-red-50 p-8 rounded-3xl border border-red-100">
        <h3 className="text-red-900 font-bold">Danger Zone</h3>
        <p className="text-red-700 text-sm mt-1 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
        <button className="bg-red-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-100">
          Delete Account
        </button>
      </div>
    </div>
  );
}
