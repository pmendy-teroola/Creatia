import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PenTool, Calendar, Palette, Settings, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { cn } from '../lib/utils';

export default function Sidebar() {
  const { logout } = useAuth();

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/generate', icon: PenTool, label: 'Generate Content' },
    { to: '/calendar', icon: Calendar, label: 'Calendar' },
    { to: '/brand', icon: Palette, label: 'Brand Builder' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 flex items-center gap-2">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">CreateAI</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
