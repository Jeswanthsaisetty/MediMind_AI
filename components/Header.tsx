
import React from 'react';

interface HeaderProps {
  activeTab: 'predict' | 'chat' | 'hospitals';
  setActiveTab: (tab: 'predict' | 'chat' | 'hospitals') => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">MediMind <span className="text-blue-600">AI</span></span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={() => setActiveTab('predict')}
              className={`text-sm font-medium transition-colors ${activeTab === 'predict' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Analyze Symptoms
            </button>
            <button 
              onClick={() => setActiveTab('hospitals')}
              className={`text-sm font-medium transition-colors ${activeTab === 'hospitals' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Find Specialists
            </button>
            <button 
              onClick={() => setActiveTab('chat')}
              className={`text-sm font-medium transition-colors ${activeTab === 'chat' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              AI Doctor Chat
            </button>
          </nav>
          <div className="md:hidden">
            {/* Mobile menu could go here */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
