import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Pencil, Trash2, LogOut, Eye, EyeOff, CheckCircle,
    XCircle, AlertTriangle, X, Loader2, Briefcase, MapPin, Clock
} from 'lucide-react';

const API_BASE = 'https://pink-echidna-330123.hostingersite.com/api';

const EMPTY_JOB = {
    title: '', department: '', location: 'Remote', type: 'Full-Time',
    description: '', requirements: '', is_active: 1,
};

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

export default function AdminCareers() {
    const router = useRouter();
    const [token, setToken] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editJob, setEditJob] = useState(null); // null = create new
    const [formData, setFormData] = useState(EMPTY_JOB);
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null); // job id
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

    const fetchJobs = useCallback(async (tok) => {
        if (!tok) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/careers-admin.php`, { headers: { Authorization: `Bearer ${tok}` } });
            const data = await res.json();
            if (data.success) setJobs(data.data);
        } catch {
            showToast('Failed to load jobs', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (token) fetchJobs(token);
    }, [token, fetchJobs]);

    const showToast = (msg, type = 'success') => setToast({ msg, type });

    const openCreate = () => {
        setEditJob(null);
        setFormData(EMPTY_JOB);
        setModalOpen(true);
    };

    const openEdit = (job) => {
        setEditJob(job);
        setFormData({
            title: job.title, department: job.department, location: job.location,
            type: job.type, description: job.description, requirements: job.requirements,
            is_active: job.is_active,
        });
        setModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const body = editJob ? { ...formData, id: editJob.id } : formData;
            const method = editJob ? 'PUT' : 'POST';
            const res = await fetch(`${API_BASE}/careers-admin.php`, {
                method, headers: authHeaders(token), body: JSON.stringify(body),
            });
            const data = await res.json();
            if (data.success) {
                showToast(editJob ? 'Job updated!' : 'Job created!');
                setModalOpen(false);
                fetchJobs(token);
            } else {
                showToast(data.error || 'Error saving job', 'error');
            }
        } catch {
            showToast('Network error', 'error');
        } finally {
            setSaving(false);
        }
    };

    const toggleActive = async (job) => {
        try {
            const res = await fetch(`${API_BASE}/careers-admin.php`, {
                method: 'PUT',
                headers: authHeaders(token),
                body: JSON.stringify({ ...job, is_active: job.is_active ? 0 : 1 }),
            });
            const data = await res.json();
            if (data.success) {
                showToast(job.is_active ? 'Job deactivated' : 'Job activated');
                fetchJobs(token);
            }
        } catch {
            showToast('Failed to update status', 'error');
        }
    };

    const handleDelete = async () => {
        if (!deleteConfirm) return;
        setDeleting(true);
        try {
            const res = await fetch(`${API_BASE}/careers-admin.php`, {
                method: 'DELETE',
                headers: authHeaders(token),
                body: JSON.stringify({ id: deleteConfirm }),
            });
            const data = await res.json();
            if (data.success) {
                showToast('Job deleted');
                setDeleteConfirm(null);
                fetchJobs(token);
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
                <title>Admin – Careers | Vikrin</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="min-h-screen bg-gray-50">
                {/* Topbar */}
                <header className="bg-[#1F3CAB] text-white px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-lg">
                    <div className="flex items-center gap-3">
                        <Briefcase className="w-6 h-6" />
                        <div>
                            <h1 className="font-bold text-lg leading-tight">Vikrin Admin</h1>
                            <p className="text-white/70 text-xs">Careers Management</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <a href="/careers" target="_blank" rel="noopener noreferrer"
                            className="hidden sm:flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition">
                            <Eye className="w-4 h-4" /> View Page
                        </a>
                        <button onClick={logout}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition">
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                    </div>
                </header>

                <main className="max-w-5xl mx-auto px-4 py-8">
                    {/* Stats + Add btn */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Job Listings</h2>
                            <p className="text-gray-500 text-sm mt-1">
                                {jobs.filter(j => j.is_active == 1).length} active · {jobs.filter(j => j.is_active == 0).length} inactive
                            </p>
                        </div>
                        <button
                            onClick={openCreate}
                            className="flex items-center gap-2 bg-[#1F3CAB] hover:bg-[#162d8a] text-white px-5 py-3 rounded-xl font-semibold transition hover:scale-105 shadow-md"
                        >
                            <Plus className="w-5 h-5" /> Add New Job
                        </button>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-[#1F3CAB]" />
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && jobs.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border">
                            <div className="text-5xl mb-4">📋</div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Jobs Yet</h3>
                            <p className="text-gray-500 mb-6">Click "Add New Job" to post your first opening.</p>
                        </div>
                    )}

                    {/* Job Cards */}
                    <div className="space-y-4">
                        {jobs.map(job => (
                            <motion.div
                                key={job.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${job.is_active == 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                {job.is_active == 1 ? '● Active' : '○ Inactive'}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-1">
                                            {job.department && <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{job.department}</span>}
                                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{job.type}</span>
                                        </div>
                                        <p className="text-gray-500 text-sm mt-2 line-clamp-2">{job.description}</p>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            onClick={() => toggleActive(job)}
                                            title={job.is_active == 1 ? 'Deactivate' : 'Activate'}
                                            className={`p-2 rounded-lg border transition ${job.is_active == 1 ? 'border-green-200 text-green-600 hover:bg-green-50' : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}
                                        >
                                            {job.is_active == 1 ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                        </button>
                                        <button
                                            onClick={() => openEdit(job)}
                                            className="p-2 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(job.id)}
                                            className="p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition"
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

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {modalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="bg-[#1F3CAB] px-6 py-5 rounded-t-2xl flex items-center justify-between text-white">
                                <h2 className="text-xl font-bold">{editJob ? 'Edit Job' : 'Add New Job'}</h2>
                                <button onClick={() => setModalOpen(false)}><X className="w-5 h-5" /></button>
                            </div>

                            <form onSubmit={handleSave} className="p-6 space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                                        <input required value={formData.title} onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
                                            placeholder="e.g. Frontend Developer"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3CAB]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                        <input value={formData.department} onChange={e => setFormData(f => ({ ...f, department: e.target.value }))}
                                            placeholder="e.g. Engineering"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3CAB]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                        <input value={formData.location} onChange={e => setFormData(f => ({ ...f, location: e.target.value }))}
                                            placeholder="Remote / Hyderabad"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3CAB]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                                        <select value={formData.type} onChange={e => setFormData(f => ({ ...f, type: e.target.value }))}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3CAB] bg-white">
                                            {['Full-Time', 'Part-Time', 'Internship', 'Freelance', 'Contract'].map(t => (
                                                <option key={t}>{t}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select value={formData.is_active} onChange={e => setFormData(f => ({ ...f, is_active: parseInt(e.target.value) }))}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3CAB] bg-white">
                                            <option value={1}>Active (Visible)</option>
                                            <option value={0}>Inactive (Hidden)</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Description *</label>
                                    <textarea required rows={5} value={formData.description}
                                        onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                                        placeholder="Describe the role, responsibilities, and what the candidate will be doing day to day…"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3CAB] resize-none" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                                    <textarea rows={4} value={formData.requirements}
                                        onChange={e => setFormData(f => ({ ...f, requirements: e.target.value }))}
                                        placeholder="List required skills, experience, qualifications…"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3CAB] resize-none" />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setModalOpen(false)}
                                        className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={saving}
                                        className="flex-1 bg-[#1F3CAB] hover:bg-[#162d8a] text-white py-3 rounded-xl font-semibold transition disabled:opacity-60 flex items-center justify-center gap-2">
                                        {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : editJob ? 'Update Job' : 'Create Job'}
                                    </button>
                                </div>
                            </form>
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
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Job?</h3>
                            <p className="text-gray-500 text-sm mb-6">This action cannot be undone. The job listing will be permanently removed.</p>
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
