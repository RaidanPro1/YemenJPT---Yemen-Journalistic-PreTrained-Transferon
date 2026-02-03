import React, { useState, useEffect } from 'react';

interface RootAuthGuardProps {
  children: (token: string) => React.ReactNode;
}

const RootAuthGuard: React.FC<RootAuthGuardProps> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('info@raidan.pro');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsAuthenticating(true);
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      
      const res = await fetch('/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setAuthToken(data.access_token);
      } else {
        const errorData = await res.json();
        setError(errorData.detail || 'Authentication failed. Please check credentials.');
        setPassword('');
      }
    } catch (e) {
      setError('Network error. Is the backend API running?');
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (authToken) {
    return <>{children(authToken)}</>;
  }

  return (
    <div className="absolute inset-0 bg-slate-900/50 dark:bg-black/70 backdrop-blur-lg flex items-center justify-center z-50 animate-in fade-in">
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center">
        <div className="w-16 h-16 bg-brand-cyan/10 text-brand-cyan rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          🔑
        </div>
        <h2 className="text-xl font-black text-slate-800 dark:text-white">Root Access Required</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">Enter your administrator credentials to proceed.</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full bg-slate-50 dark:bg-[#020617] border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-slate-50 dark:bg-[#020617] border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan"
            required
          />
          {error && <p className="text-xs text-red-500 text-left">{error}</p>}
          <button
            type="submit"
            disabled={isAuthenticating}
            className="w-full bg-brand-blue text-white py-3 rounded-lg text-sm font-black uppercase tracking-wider hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isAuthenticating ? 'Authenticating...' : 'Authenticate'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RootAuthGuard;
