import { useState } from 'react';
import { Dumbbell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SignIn() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    if (mode === 'signin') {
      const { error } = await signIn(email, password);
      if (error) setError(error);
    } else {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error);
      } else {
        setMessage('Check your email for a confirmation link, then sign in.');
      }
    }

    setLoading(false);
  };

  const switchMode = () => {
    setMode((m) => (m === 'signin' ? 'signup' : 'signin'));
    setError(null);
    setMessage(null);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-indigo-600 rounded-2xl p-3">
            <Dumbbell className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">Workout Tracker</div>
            <div className="text-sm text-gray-400">Track your gains, crush your goals</div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <div className="text-xl font-extrabold text-white mb-6">
            {mode === 'signin' ? 'Sign in' : 'Create account'}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 placeholder-gray-600"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 placeholder-gray-600"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-950/50 border border-red-900 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            {message && (
              <div className="text-sm text-green-400 bg-green-950/50 border border-green-900 rounded-xl px-4 py-3">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-extrabold py-3 rounded-xl transition-colors"
            >
              {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div className="mt-5 text-center">
            <button
              onClick={switchMode}
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {mode === 'signin'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
