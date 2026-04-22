"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
            const res = await fetch('http://localhost:8000/auth/send-otp', {
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
            const res = await fetch('http://localhost:8000/auth/signup', {
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
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-[10%] right-[-10%] w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob"></div>
            <div className="absolute bottom-[20%] left-[-10%] w-96 h-96 bg-teal-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-2000"></div>

            <div className="relative z-10 w-full max-w-lg p-8 bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)]">
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
                                    className="w-full px-4 py-3 bg-zinc-800/50 border border-white/5 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
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
                                    className="w-full px-4 py-3 bg-zinc-800/50 border border-white/5 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
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
                                    className="w-full px-4 py-3 bg-zinc-800/50 border border-white/5 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
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
                                    className="w-full px-4 py-3 bg-zinc-800/50 border border-white/5 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="col-span-2 flex items-center mt-2 bg-zinc-800/30 p-4 rounded-xl border border-white/5">
                                <input
                                    type="checkbox"
                                    id="iiti"
                                    checked={formData.iiti}
                                    onChange={(e) => setFormData({ ...formData, iiti: e.target.checked })}
                                    className="w-5 h-5 rounded border-zinc-600 text-emerald-500 focus:ring-emerald-500 bg-zinc-800"
                                />
                                <label htmlFor="iiti" className="ml-3 block text-sm font-medium text-zinc-300">
                                    Are you from IIIT?
                                </label>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-semibold rounded-xl transition-all duration-300 transform shadow-lg shadow-emerald-500/30 mt-4"
                        >
                            {loading ? 'Processing...' : 'Continue to verify Email'}
                        </button>
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
                                className="w-full px-4 py-3 bg-zinc-800/50 border border-white/5 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 tracking-widest text-center text-xl font-mono"
                                placeholder="------"
                            />
                        </div>
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-semibold rounded-xl transition-all duration-300 transform shadow-lg shadow-emerald-500/30"
                        >
                            {loading ? 'Verifying...' : 'Complete Registration'}
                        </button>

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
                        <a href="/login" className="text-white hover:text-emerald-400 transition-colors font-medium">Sign in</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
