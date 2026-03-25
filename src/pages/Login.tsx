import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Sparkles } from 'lucide-react';

import { useLanguage } from '../LanguageContext';

export default function Login() {
  const { user, login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center">
          <div className="inline-flex bg-blue-600 p-3 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{t('appName')}</h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('readyToCreateSub')}
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <button
            onClick={login}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 border border-gray-300 rounded-2xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 active:scale-95"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            {t('login')} with Google
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
