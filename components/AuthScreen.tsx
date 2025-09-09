
import React, { useState } from 'react';
import { ArrowRightIcon, LockIcon, MailIcon } from './Icons';

interface AuthScreenProps {
    onLoginSuccess: () => void;
}

type Role = 'Creator' | 'User' | 'Admin';

const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [role, setRole] = useState<Role>('Creator');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Simulate a network request and bypass auth for demo
        setTimeout(() => {
            onLoginSuccess();
            setIsLoading(false);
        }, 1000);
    };
    
    const roles: Role[] = ['Creator', 'User', 'Admin'];
    const demoCredentials: Record<Role, string> = {
        Creator: 'creator@cabana.com / password123',
        User: 'user@cabana.com / password123',
        Admin: 'admin@cabana.com / password123',
    };

    return (
        <main className="flex items-center justify-center min-h-screen p-4 bg-dots-pattern">
            <div className="w-full max-w-md mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight iridescent-text bg-clip-text text-transparent">
                        CABANA
                    </h1>
                    <p className="text-gray-400 mt-3">The premier platform for the professional creator.</p>
                </div>
                
                <div className="bg-black/50 border border-white/10 rounded-2xl shadow-2xl shadow-purple-500/10 backdrop-blur-lg p-8">
                    <div className="flex justify-center mb-6 bg-black/50 border border-white/10 rounded-lg p-1">
                        {roles.map((r) => (
                            <button
                                key={r}
                                onClick={() => setRole(r)}
                                className={`w-full py-2 text-sm font-semibold rounded-md transition-colors ${
                                    role === r
                                        ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                                        : 'text-gray-400 hover:bg-white/5'
                                }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                                    <MailIcon />
                                </span>
                                <input
                                    type="email"
                                    placeholder={`${role} Email Address`}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                />
                            </div>

                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                                    <LockIcon />
                                </span>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}
                        
                        <div className="text-center text-xs text-gray-500 mt-6 p-2 bg-white/5 rounded-md border border-white/10">
                             <p><span className="font-bold">Demo:</span> {demoCredentials[role]}</p>
                        </div>

                        <div className="mt-8">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg shadow-purple-500/30 text-lg"
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        Login as {role}
                                        <ArrowRightIcon />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
                
                <p className="text-center text-xs text-gray-600 mt-8">
                    © 2025 CABANA. All Rights Reserved.
                </p>
            </div>
        </main>
    );
};

export default AuthScreen;
