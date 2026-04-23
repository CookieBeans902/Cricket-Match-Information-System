"use client";
import { API_BASE_URL } from "@/lib/constants";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function SignupPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        age: '',
        iiti: false
    });
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/auth/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email }),
            });

            if (res.ok) {
                setStep(2);
            } else {
                const err = await res.json();
                setError(err.detail || 'Failed to send OTP');
            }
        } catch (err) {
            setError(`Something went wrong. Please try again. ${err}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    username: formData.username,
                    password: formData.password,
                    age: parseInt(formData.age) || null,
                    iiti: formData.iiti,
                    otp: otp
                }),
            });
            console.log(res);
            if (res.ok) {
                alert('Account created successfully!');
                router.push('/login');
            } else {
                const err = await res.json();
                setError(err.detail || 'Signup failed');
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
                className="absolute top-[10%] right-[-10%] w-[30rem] h-[30rem] bg-green-600 rounded-full mix-blend-screen filter blur-[128px] opacity-20"
            />
            <motion.div 
                animate={{ rotate: -360, scale: [1, 1.5, 1] }} 
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[20%] left-[-10%] w-[30rem] h-[30rem] bg-emerald-600 rounded-full mix-blend-screen filter blur-[128px] opacity-20"
            />

            <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                className="relative z-10 w-full max-w-lg p-8 bg-zinc-950/60 backdrop-blur-2xl border border-green-500/20 rounded-3xl shadow-[0_0_50px_rgba(34,197,94,0.15)]"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Create Account</h1>
                    <p className="text-zinc-400 text-sm">Join us and experience the next generation</p>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleSendOtp} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-zinc-300 mb-1.5 pl-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-black border border-green-500/30 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all shadow-[inset_0_0_15px_rgba(34,197,94,0.05)]"
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-sm font-medium text-zinc-300 mb-1.5 pl-1">Username</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full px-4 py-3 bg-black border border-green-500/30 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all shadow-[inset_0_0_15px_rgba(34,197,94,0.05)]"
                                    placeholder="Username123"
                                />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-sm font-medium text-zinc-300 mb-1.5 pl-1">Age</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.age}
                                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                    className="w-full px-4 py-3 bg-black border border-green-500/30 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all shadow-[inset_0_0_15px_rgba(34,197,94,0.05)]"
                                    placeholder="e.g. 25"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-zinc-300 mb-1.5 pl-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-3 bg-black border border-green-500/30 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all shadow-[inset_0_0_15px_rgba(34,197,94,0.05)]"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="col-span-2 flex items-center mt-2 bg-black/50 p-4 rounded-xl border border-green-500/20">
                                <input
                                    type="checkbox"
                                    id="iiti"
                                    checked={formData.iiti}
                                    onChange={(e) => setFormData({ ...formData, iiti: e.target.checked })}
                                    className="w-5 h-5 rounded border-green-500/50 text-green-500 focus:ring-green-500 bg-black"
                                />
                                <label htmlFor="iiti" className="ml-3 block text-sm font-medium text-zinc-300">
                                    Are you from IIT Indore Buddy?
                                </label>
                            </div>
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
                            className="w-full py-3.5 bg-green-500 hover:bg-green-400 text-black font-extrabold rounded-xl transition-all duration-300 disabled:opacity-50 flex justify-center items-center shadow-[0_4px_14px_0_rgba(34,197,94,0.39)] mt-4"
                        >
                            {loading ? 'Processing...' : 'Continue to verify Email'}
                        </motion.button>
                    </form>
                ) : (
                    <form onSubmit={handleSignup} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-1.5 pl-1">Enter Verification Code</label>
                            <p className="text-xs text-zinc-500 mb-3 pl-1">We sent a 6-digit code to {formData.email}</p>
                            <input
                                type="text"
                                required
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-4 py-3 bg-black border border-green-500/30 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500 tracking-widest text-center text-xl font-mono shadow-[inset_0_0_15px_rgba(34,197,94,0.05)]"
                                placeholder="------"
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
                            {loading ? 'Verifying...' : 'Complete Registration'}
                        </motion.button>

                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full py-2 text-sm text-zinc-400 hover:text-white transition-colors"
                        >
                            Back to details
                        </button>
                    </form>
                )}

                <div className="mt-8 text-center">
                    <p className="text-zinc-400 text-sm">
                        Already have an account?{' '}
                        <a href="/login" className="text-green-400 hover:text-green-300 transition-colors font-medium hover:underline decoration-green-400/50 underline-offset-4">Sign in</a>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
