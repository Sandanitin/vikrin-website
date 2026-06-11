import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    Plus, Pencil, Trash2, LogOut, Eye, EyeOff, CheckCircle,
    XCircle, AlertTriangle, X, Loader2, BookOpen, User, Calendar, LayoutDashboard, Briefcase, Users
} from 'lucide-react';

const API_BASE = 'https://pink-echidna-330123.hostingersite.com/api';

const EMPTY_POST = {
    title: '', slug: '', summary: '', content: '', image_url: '', author: 'Vikrin Team', is_published: 1
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

export default function AdminBlogs() {
    const router = useRouter();
    const [token, setToken] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editPost, setEditPost] = useState(null); // null = create
    const [formData, setFormData] = useState(EMPTY_POST);
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null); // post id
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

    const fetchPosts = useCallback(async (tok) => {
        if (!tok) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/blogs-admin.php`, { headers: { Authorization: `Bearer ${tok}` } });
            const data = await res.json();
            if (data.success) setPosts(data.data);
        } catch {
            showToast('Failed to load posts', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (token) fetchPosts(token);
    }, [token, fetchPosts]);

    const showToast = (msg, type = 'success') => setToast({ msg, type });

    // Auto slug generator
    const handleTitleChange = (val) => {
        const slugified = val.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
        setFormData(f => ({ ...f, title: val, slug: slugified }));
    };

    const openCreate = () => {
        setEditPost(null);
        setFormData(EMPTY_POST);
        setModalOpen(true);
    };

    const openEdit = (post) => {
        setEditPost(post);
        setFormData({
            title: post.title, slug: post.slug, summary: post.summary,
            content: post.content, image_url: post.image_url, author: post.author,
            is_published: post.is_published
        });
        setModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const body = editPost ? { ...formData, id: editPost.id } : formData;
            const method = editPost ? 'PUT' : 'POST';
            const res = await fetch(`${API_BASE}/blogs-admin.php`, {
                method, headers: authHeaders(token), body: JSON.stringify(body),
            });
            const data = await res.json();
            if (data.success) {
                showToast(editPost ? 'Post updated!' : 'Post created!');
                setModalOpen(false);
                fetchPosts(token);
            } else {
                showToast(data.error || 'Error saving post', 'error');
            }
        } catch {
            showToast('Network error', 'error');
        } finally {
            setSaving(false);
        }
    };

    const togglePublish = async (post) => {
        try {
            const res = await fetch(`${API_BASE}/blogs-admin.php`, {
                method: 'PUT',
                headers: authHeaders(token),
                body: JSON.stringify({ ...post, is_published: Number(post.is_published) === 1 ? 0 : 1 }),
            });
            const data = await res.json();
            if (data.success) {
                showToast(Number(post.is_published) === 1 ? 'Post unpublished' : 'Post published');
                fetchPosts(token);
            }
        } catch {
            showToast('Failed to update status', 'error');
        }
    };

    const handleDelete = async () => {
        if (!deleteConfirm) return;
        setDeleting(true);
        try {
            const res = await fetch(`${API_BASE}/blogs-admin.php`, {
                method: 'DELETE',
                headers: authHeaders(token),
                body: JSON.stringify({ id: deleteConfirm }),
            });
            const data = await res.json();
            if (data.success) {
                showToast('Post deleted');
                setDeleteConfirm(null);
                fetchPosts(token);
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
                <title>Admin – Blogs | Vikrin</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="min-h-screen bg-gray-50">
                {/* Header Navbar */}
                <header className="bg-[#1F3CAB] text-white px-6 py-4 flex flex-col md:flex-row items-center justify-between sticky top-0 z-40 shadow-lg gap-4">
                    <div className="flex items-center gap-3">
                        <BookOpen className="w-6 h-6" />
                        <div>
                            <h1 className="font-bold text-lg leading-tight">Vikrin Admin</h1>
                            <p className="text-white/70 text-xs">Blogs & News Management</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <Link href="/admin/careers" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition">
                            <Briefcase className="w-4 h-4" /> Manage Jobs
                        </Link>
                        <Link href="/admin/applications" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition">
                            <Users className="w-4 h-4" /> View Applicants
                        </Link>
                        <a href="/blog" target="_blank" rel="noopener noreferrer"
                            className="hidden sm:flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition">
                            <Eye className="w-4 h-4" /> View Page
                        </a>
                        <button onClick={logout} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition">
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                    </div>
                </header>

                <main className="max-w-5xl mx-auto px-4 py-8">
                    {/* Stats bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Blog Posts</h2>
                            <p className="text-gray-500 text-sm mt-1">
                                {posts.filter(p => p.is_published == 1).length} published · {posts.filter(p => p.is_published == 0).length} drafts
                            </p>
                        </div>
                        <button
                            onClick={openCreate}
                            className="flex items-center gap-2 bg-[#1F3CAB] hover:bg-[#162d8a] text-white px-5 py-3 rounded-xl font-semibold transition hover:scale-105 shadow-md"
                        >
                            <Plus className="w-5 h-5" /> Add New Post
                        </button>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-[#1F3CAB]" />
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && posts.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border">
                            <div className="text-5xl mb-4">📝</div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Blog Posts Yet</h3>
                            <p className="text-gray-500 mb-6">Click &quot;Add New Post&quot; to publish your first article.</p>
                        </div>
                    )}

                    {/* Post Listings */}
                    <div className="space-y-4">
                        {posts.map(post => (
                            <motion.div
                                key={post.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <h3 className="text-lg font-bold text-gray-900">{post.title}</h3>
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${post.is_published == 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                {post.is_published == 1 ? '● Published' : '○ Draft'}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2 font-medium">
                                            <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {post.author}</span>
                                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(post.published_at).toLocaleDateString()}</span>
                                            <span className="text-[#1F3CAB] font-semibold">Slug: {post.slug}</span>
                                        </div>
                                        <p className="text-gray-500 text-sm mt-3 line-clamp-2">{post.summary}</p>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            onClick={() => togglePublish(post)}
                                            title={post.is_published == 1 ? 'Unpublish (Draft)' : 'Publish'}
                                            className={`p-2 rounded-lg border transition ${post.is_published == 1 ? 'border-green-200 text-green-600 hover:bg-green-50' : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}
                                        >
                                            {post.is_published == 1 ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                        </button>
                                        <button
                                            onClick={() => openEdit(post)}
                                            className="p-2 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(post.id)}
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
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="bg-[#1F3CAB] px-6 py-5 rounded-t-2xl flex items-center justify-between text-white">
                                <h2 className="text-xl font-bold">{editPost ? 'Edit Blog Post' : 'Add New Blog Post'}</h2>
                                <button onClick={() => setModalOpen(false)}><X className="w-5 h-5" /></button>
                            </div>

                            <form onSubmit={handleSave} className="p-6 space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Post Title *</label>
                                        <input required value={formData.title} 
                                            onChange={e => handleTitleChange(e.target.value)}
                                            placeholder="e.g. 10 Best Digital Marketing Strategies"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3CAB]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL identifier) *</label>
                                        <input required value={formData.slug} 
                                            onChange={e => setFormData(f => ({ ...f, slug: e.target.value }))}
                                            placeholder="10-best-digital-marketing-strategies"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3CAB]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                                        <input value={formData.author} onChange={e => setFormData(f => ({ ...f, author: e.target.value }))}
                                            placeholder="Vikrin Team"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3CAB]" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Cover Graphic)</label>
                                        <input value={formData.image_url} onChange={e => setFormData(f => ({ ...f, image_url: e.target.value }))}
                                            placeholder="https://images.unsplash.com/... or /careers_hero.png"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3CAB]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Publish Status</label>
                                        <select value={formData.is_published} onChange={e => setFormData(f => ({ ...f, is_published: parseInt(e.target.value) }))}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3CAB] bg-white">
                                            <option value={1}>Publish Now</option>
                                            <option value={0}>Save as Draft</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Short Summary *</label>
                                    <textarea required rows={3} value={formData.summary}
                                        onChange={e => setFormData(f => ({ ...f, summary: e.target.value }))}
                                        placeholder="Enter a brief, engaging summary of this blog post for previews…"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3CAB] resize-none" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Post Content (HTML allowed) *</label>
                                    <textarea required rows={10} value={formData.content}
                                        onChange={e => setFormData(f => ({ ...f, content: e.target.value }))}
                                        placeholder="Write your article content here. You can use standard HTML tags like <p>, <h3>, <strong>, <ul>, etc."
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3CAB] resize-none font-mono" />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setModalOpen(false)}
                                        className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={saving}
                                        className="flex-1 bg-[#1F3CAB] hover:bg-[#162d8a] text-white py-3 rounded-xl font-semibold transition disabled:opacity-60 flex items-center justify-center gap-2">
                                        {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : editPost ? 'Update Post' : 'Create Post'}
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
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Blog Post?</h3>
                            <p className="text-gray-500 text-sm mb-6">This action cannot be undone. The article will be permanently removed.</p>
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
