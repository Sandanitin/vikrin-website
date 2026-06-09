import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react';

const API_BASE = 'https://pink-echidna-330123.hostingersite.com/api';

export default function AdminLogin() {
    const router = useRouter();
    const [form, setForm] = useState({ username: '', password: '' });
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE}/admin-login.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (data.success) {
                localStorage.setItem('vikrin_admin_token', data.token);
                localStorage.setItem('vikrin_admin_expires', data.expires);
                router.push('/admin/careers');
            } else {
                setError(data.error || 'Invalid credentials');
            }
        } catch {
            setError('Network error. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Admin Login – Vikrin</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            <div className="min-h-screen bg-[#042927] bg-grid flex flex-col items-center justify-center px-4 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-[#042927]/90 via-[#042927]/40 to-transparent pointer-events-none" />
                
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 relative z-10"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-br from-[#1F3CAB] to-[#122470] px-8 py-10 text-white text-center relative overflow-hidden">
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
                        <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
                        
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg backdrop-blur-md border border-white/10">
                            <LogIn className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Admin Portal</h1>
                        <p className="text-white/70 text-sm mt-1.5 font-medium">Vikrin Careers Management</p>
                    </div>
 
                    <form onSubmit={handleLogin} className="px-8 py-8 space-y-6">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-gray-700">Username</label>
                            <input
                                id="admin-username"
                                type="text"
                                required
                                autoComplete="username"
                                placeholder="vikrin@gmil.com"
                                value={form.username}
                                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3CAB] transition text-gray-900 placeholder-gray-400 bg-white shadow-sm"
                            />
                        </div>
 
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-gray-700">Password</label>
                            <div className="relative">
                                <input
                                    id="admin-password"
                                    type={showPwd ? 'text' : 'password'}
                                    required
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3CAB] transition pr-12 text-gray-900 placeholder-gray-400 bg-white shadow-sm [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden"
                                />
                                <button
                                    type="button"
                                    onPointerDown={(e) => {
                                        e.preventDefault(); // Prevents input from losing focus
                                        setShowPwd(v => !v);
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10 p-1"
                                >
                                    {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
 
                        {error && (
                            <p className="text-red-600 text-sm bg-red-50 border border-red-200 px-4 py-3 rounded-xl font-medium">{error}</p>
                        )}
 
                        <button
                            type="submit"
                            id="admin-login-btn"
                            disabled={loading}
                            className="w-full bg-[#1F3CAB] hover:bg-[#162d8a] text-white py-3.5 rounded-xl font-bold transition duration-200 disabled:opacity-60 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 shadow-lg shadow-blue-900/10 cursor-pointer"
                        >
                            {loading
                                ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Signing in…</>
                                : <><LogIn className="w-4 h-4" /> Sign In</>
                            }
                        </button>
 
                        <p className="text-center text-xs text-gray-400 font-medium">
                            This page is for authorized Vikrin administrators only.
                        </p>
                    </form>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 relative z-10"
                >
                    <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition text-sm font-semibold">
                        <ArrowLeft className="w-4 h-4" /> Back to Website
                    </Link>
                </motion.div>
            </div>
        </>
    );
}
