import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn } from 'lucide-react';

const API_BASE = 'https://u177524058.pink-echidna-330123.hostingersite.com/api';

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
            <div className="min-h-screen bg-[#042927] flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-[#1F3CAB] px-8 py-8 text-white text-center">
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <LogIn className="w-7 h-7" />
                        </div>
                        <h1 className="text-2xl font-bold">Admin Portal</h1>
                        <p className="text-white/70 text-sm mt-1">Vikrin Careers Management</p>
                    </div>

                    <form onSubmit={handleLogin} className="px-8 py-8 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input
                                id="admin-username"
                                type="text"
                                required
                                autoComplete="username"
                                placeholder="admin"
                                value={form.username}
                                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3CAB] transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <input
                                    id="admin-password"
                                    type={showPwd ? 'text' : 'password'}
                                    required
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3CAB] transition pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>
                        )}

                        <button
                            type="submit"
                            id="admin-login-btn"
                            disabled={loading}
                            className="w-full bg-[#1F3CAB] hover:bg-[#162d8a] text-white py-3 rounded-xl font-semibold transition disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                            {loading
                                ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Signing in…</>
                                : <><LogIn className="w-4 h-4" /> Sign In</>
                            }
                        </button>

                        <p className="text-center text-xs text-gray-400">
                            This page is for authorized Vikrin administrators only.
                        </p>
                    </form>
                </motion.div>
            </div>
        </>
    );
}
