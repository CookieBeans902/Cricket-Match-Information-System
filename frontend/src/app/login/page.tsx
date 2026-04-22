"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('http://localhost:8000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('user', JSON.stringify(data.user));
                alert('Login successful!');
                router.push('/'); 
            } else {
                const err = await res.json();
                setError(err.detail || 'Login failed');
            }
        } catch (err) {
            setError(`Something went wrong. Please try again. ${err}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
            {/* Background blobs */}
            <motion.div 
                animate={{ rotate: 360, scale: [1, 1.2, 1] }} 
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-green-600 rounded-full mix-blend-screen filter blur-[128px] opacity-20"
            />
            <motion.div 
                animate={{ rotate: -360, scale: [1, 1.5, 1] }} 
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-[20%] right-[-10%] w-[30rem] h-[30rem] bg-emerald-600 rounded-full mix-blend-screen filter blur-[128px] opacity-20"
            />
            <motion.div 
                animate={{ y: [0, -50, 0], x: [0, 50, 0] }} 
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[-20%] left-[20%] w-[30rem] h-[30rem] bg-green-400 rounded-full mix-blend-screen filter blur-[128px] opacity-20"
            />
            
            <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                className="relative z-10 w-full max-w-md p-8 bg-zinc-950/60 backdrop-blur-2xl border border-green-500/20 rounded-3xl shadow-[0_0_50px_rgba(34,197,94,0.15)]"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome Back</h1>
                    <p className="text-zinc-400 text-sm">Enter your credentials to access your account</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1.5 pl-1">Email Address</label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-black border border-green-500/30 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 shadow-[inset_0_0_15px_rgba(34,197,94,0.05)]"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1.5 pl-1">Password</label>
                        <input 
                            type="password"
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-black border border-green-500/30 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 shadow-[inset_0_0_15px_rgba(34,197,94,0.05)]"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <motion.button 
                        whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(34,197,94,0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        type="submit" 
                        disabled={loading}
                        className="w-full py-3.5 bg-green-500 hover:bg-green-400 text-black font-extrabold rounded-xl transition-all duration-300 disabled:opacity-50 flex justify-center items-center shadow-[0_4px_14px_0_rgba(34,197,94,0.39)]"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </motion.button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-zinc-400 text-sm">
                        Don't have an account?{' '}
                        <a href="/signup" className="text-green-400 hover:text-green-300 transition-colors font-medium hover:underline decoration-green-400/50 underline-offset-4">Create an account</a>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
