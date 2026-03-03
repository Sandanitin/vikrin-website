import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trash2, LogOut, Eye, CheckCircle, FileText,
    XCircle, AlertTriangle, X, Loader2, Users, LayoutDashboard, Clock
} from 'lucide-react';
import Link from 'next/link';

const API_BASE = 'https://pink-echidna-330123.hostingersite.com/api';

function Toast({ msg, type, onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 4000);
        return () => clearTimeout(t);
    }, [onClose]);
    const colors = type === 'success' ? 'bg-green-600' : 'bg-red-600';
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
            className={`fixed bottom-6 right-6 z-[100] ${colors} text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3`}
        >
            {type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
            <span className="text-sm font-medium">{msg}</span>
            <button onClick={onClose}><X className="w-4 h-4 opacity-70" /></button>
        </motion.div>
    );
}

export default function AdminApplications() {
    const router = useRouter();
    const [token, setToken] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewCoverLetter, setViewCoverLetter] = useState(null); // application object
    const [deleteConfirm, setDeleteConfirm] = useState(null); // id
    const [deleting, setDeleting] = useState(false);
    const [toast, setToast] = useState(null);

    // Auth guard
    useEffect(() => {
        const t = localStorage.getItem('vikrin_admin_token');
        const exp = parseInt(localStorage.getItem('vikrin_admin_expires') || '0', 10);
        if (!t || Date.now() / 1000 > exp) {
            router.replace('/admin/login');
            return;
        }
        setToken(t);
    }, [router]);

    const authHeaders = useCallback((token) => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    }), []);

    const fetchApplications = useCallback(async (tok) => {
        if (!tok) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/applications-admin.php`, { headers: authHeaders(tok) });
            const data = await res.json();
            if (data.success) setApplications(data.data);
        } catch {
            showToast('Failed to load applications', 'error');
        } finally {
            setLoading(false);
        }
    }, [authHeaders]);

    useEffect(() => {
        if (token) fetchApplications(token);
    }, [token, fetchApplications]);

    const showToast = (msg, type = 'success') => setToast({ msg, type });

    const handleDelete = async () => {
        if (!deleteConfirm) return;
        setDeleting(true);
        try {
            const res = await fetch(`${API_BASE}/applications-admin.php`, {
                method: 'DELETE',
                headers: authHeaders(token),
                body: JSON.stringify({ id: deleteConfirm }),
            });
            const data = await res.json();
            if (data.success) {
                showToast('Application deleted');
                setDeleteConfirm(null);
                fetchApplications(token);
            } else {
                showToast('Delete failed', 'error');
            }
        } catch {
            showToast('Network error', 'error');
        } finally {
            setDeleting(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('vikrin_admin_token');
        localStorage.removeItem('vikrin_admin_expires');
        router.push('/admin/login');
    };

    if (!token) return null;

    return (
        <>
            <Head>
                <title>Admin – Applications | Vikrin</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="min-h-screen bg-gray-50">
                {/* Topbar */}
                <header className="bg-[#1F3CAB] text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between sticky top-0 z-40 shadow-lg gap-4">
                    <div className="flex items-center gap-3">
                        <Users className="w-6 h-6" />
                        <div>
                            <h1 className="font-bold text-lg leading-tight">Vikrin Admin</h1>
                            <p className="text-white/70 text-xs">Applications Dashboard</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/admin/careers" className="hidden sm:flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition">
                            <LayoutDashboard className="w-4 h-4" /> Manage Jobs
                        </Link>
                        <button onClick={logout} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition">
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                    </div>
                </header>

                <main className="max-w-6xl mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Job Applications</h2>
                            <p className="text-gray-500 text-sm mt-1">Reviewing {applications.length} submitted applications</p>
                        </div>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-[#1F3CAB]" />
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && applications.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border">
                            <div className="text-5xl mb-4">📥</div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Applications Yet</h3>
                            <p className="text-gray-500 mb-6">When candidates apply on the careers page, they will appear here.</p>
                        </div>
                    )}

                    {/* Applications List */}
                    <div className="space-y-4">
                        {applications.map(app => (
                            <motion.div
                                key={app.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <h3 className="text-lg font-bold text-gray-900">{app.name}</h3>
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                                                Applied for: {app.job_title}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                                            <span><strong>Email:</strong> <a href={`mailto:${app.email}`} className="text-[#1F3CAB] hover:underline">{app.email}</a></span>
                                            {app.phone && <span><strong>Phone:</strong> {app.phone}</span>}
                                            <span className="flex items-center gap-1 text-gray-400">
                                                <Clock className="w-3.5 h-3.5" />
                                                {new Date(app.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        {app.resume_link && (
                                            <a
                                                href={app.resume_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition text-sm font-medium"
                                                title="View Resume Document"
                                            >
                                                <FileText className="w-4 h-4" /> Resume
                                            </a>
                                        )}
                                        {app.cover_letter && (
                                            <button
                                                onClick={() => setViewCoverLetter(app)}
                                                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition text-sm font-medium"
                                                title="Read Cover Letter"
                                            >
                                                <Eye className="w-4 h-4" /> Cover Letter
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setDeleteConfirm(app.id)}
                                            className="p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition"
                                            title="Delete Application"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </main>
            </div>

            {/* Cover Letter Modal */}
            <AnimatePresence>
                {viewCoverLetter && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={e => { if (e.target === e.currentTarget) setViewCoverLetter(null); }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                        >
                            <div className="bg-[#1F3CAB] px-6 py-5 rounded-t-2xl flex items-center justify-between text-white shrink-0">
                                <div>
                                    <h2 className="text-xl font-bold">Cover Letter</h2>
                                    <p className="text-sm text-white/80">{viewCoverLetter.name} - {viewCoverLetter.job_title}</p>
                                </div>
                                <button onClick={() => setViewCoverLetter(null)}><X className="w-5 h-5" /></button>
                            </div>
                            <div className="p-6 overflow-y-auto w-full whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
                                {viewCoverLetter.cover_letter}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirm Modal */}
            <AnimatePresence>
                {deleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    >
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-sm text-center">
                            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Applicant?</h3>
                            <p className="text-gray-500 text-sm mb-6">This action cannot be undone. This application will be permanently removed.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition">
                                    Cancel
                                </button>
                                <button onClick={handleDelete} disabled={deleting}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition disabled:opacity-60 flex items-center justify-center gap-2">
                                    {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                    {deleting ? 'Deleting…' : 'Delete'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toast */}
            <AnimatePresence>
                {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>
        </>
    );
}
