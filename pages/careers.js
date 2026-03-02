import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Briefcase, ChevronDown, ChevronUp, Send, X, CheckCircle } from 'lucide-react';

const API_BASE = 'https://u177524058.pink-echidna-330123.hostingersite.com/api';

export default function Careers() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [applyJob, setApplyJob] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', phone: '', cover_letter: '', resume_link: '' });
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        fetch(`${API_BASE}/careers-get.php`)
            .then(r => r.json())
            .then(data => {
                if (data.success) setJobs(data.data);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const openApply = (job) => {
        setApplyJob(job);
        setForm({ name: '', email: '', phone: '', cover_letter: '', resume_link: '' });
        setSubmitStatus(null);
        setErrorMsg('');
    };

    const closeApply = () => {
        setApplyJob(null);
        setSubmitStatus(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrorMsg('');
        try {
            const res = await fetch(`${API_BASE}/careers-apply.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, job_title: applyJob.title }),
            });
            const data = await res.json();
            if (data.success) {
                setSubmitStatus('success');
            } else {
                setSubmitStatus('error');
                setErrorMsg(data.error || 'Something went wrong. Please try again.');
            }
        } catch {
            setSubmitStatus('error');
            setErrorMsg('Network error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Head>
                <title>Careers – Vikrin | Join Our Team</title>
                <meta name="description" content="Explore career opportunities at Vikrin. Join a passionate team building the future of digital marketing and web development." />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />

            <main className="bg-[#e5e5e5] min-h-screen">
                {/* Hero */}
                <section className="py-20 px-6 bg-[#042927] text-white text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <p className="text-green-400 font-semibold tracking-widest uppercase text-sm mb-3">We&apos;re Hiring</p>
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
                            Build the Future<br className="hidden md:block" /> with Vikrin
                        </h1>
                        <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto">
                            Join a team that creates world-class websites and marketing campaigns. Remote-friendly, growth-focused.
                        </p>
                    </motion.div>
                </section>

                {/* Why Work With Us */}
                <section className="py-16 px-6 max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-[#1F3CAB] mb-10">Why Join Vikrin?</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: '🚀', title: 'Fast Growth', desc: 'Accelerate your career with real ownership and impact.' },
                            { icon: '🌍', title: 'Remote-First', desc: 'Work from anywhere. Flexible schedules, async culture.' },
                            { icon: '💡', title: 'Learn & Grow', desc: 'Mentorship, training and exposure to top-tier clients.' },
                        ].map(({ icon, title, desc }) => (
                            <div key={title} className="bg-white rounded-2xl p-6 shadow-md text-center hover:shadow-lg transition">
                                <div className="text-4xl mb-3">{icon}</div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
                                <p className="text-gray-500 text-sm">{desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Job Listings */}
                <section className="py-12 px-6 max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-[#1F3CAB] mb-8">Open Positions</h2>

                    {loading && (
                        <div className="text-center py-20">
                            <div className="inline-block w-10 h-10 border-4 border-[#1F3CAB] border-t-transparent rounded-full animate-spin" />
                            <p className="mt-4 text-gray-500">Loading openings…</p>
                        </div>
                    )}

                    {!loading && jobs.length === 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                            <div className="text-6xl mb-4">📭</div>
                            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Openings Right Now</h3>
                            <p className="text-gray-500">We&apos;re not actively hiring at the moment, but we&apos;d love to hear from you!</p>
                            <a href="mailto:contact@vikrin.com" className="mt-6 inline-block bg-[#1F3CAB] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#162d8a] transition">
                                Send Us Your Resume
                            </a>
                        </motion.div>
                    )}

                    <div className="space-y-4">
                        {jobs.map((job, i) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.07 }}
                                className="bg-white rounded-2xl shadow-md overflow-hidden"
                            >
                                <button
                                    onClick={() => setExpandedId(expandedId === job.id ? null : job.id)}
                                    className="w-full text-left p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                                >
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                                        <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                                            {job.department && (
                                                <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {job.department}</span>
                                            )}
                                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.type}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">Hiring</span>
                                        {expandedId === job.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {expandedId === job.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-6 border-t border-gray-100 pt-4 space-y-4">
                                                <div>
                                                    <h4 className="font-semibold text-gray-800 mb-1">About This Role</h4>
                                                    <p className="text-gray-600 whitespace-pre-line text-sm leading-relaxed">{job.description}</p>
                                                </div>
                                                {job.requirements && (
                                                    <div>
                                                        <h4 className="font-semibold text-gray-800 mb-1">Requirements</h4>
                                                        <p className="text-gray-600 whitespace-pre-line text-sm leading-relaxed">{job.requirements}</p>
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => openApply(job)}
                                                    className="mt-2 inline-flex items-center gap-2 bg-[#1F3CAB] hover:bg-[#162d8a] text-white px-6 py-3 rounded-xl font-semibold transition hover:scale-105"
                                                >
                                                    <Send className="w-4 h-4" /> Apply Now
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />

            {/* Apply Modal */}
            <AnimatePresence>
                {applyJob && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={(e) => { if (e.target === e.currentTarget) closeApply(); }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                        >
                            {/* Modal Header */}
                            <div className="bg-[#1F3CAB] text-white px-6 py-5 rounded-t-2xl flex items-start justify-between">
                                <div>
                                    <p className="text-white/70 text-sm">Applying for</p>
                                    <h3 className="text-xl font-bold">{applyJob.title}</h3>
                                </div>
                                <button onClick={closeApply} className="text-white/70 hover:text-white mt-1">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {submitStatus === 'success' ? (
                                <div className="p-10 text-center">
                                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Application Sent!</h3>
                                    <p className="text-gray-500 mb-6">We&apos;ve received your application and will reach out soon. 🎉</p>
                                    <button onClick={closeApply} className="bg-[#1F3CAB] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#162d8a] transition">
                                        Close
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                    {[
                                        { label: 'Full Name *', name: 'name', type: 'text', placeholder: 'John Doe', required: true },
                                        { label: 'Email Address *', name: 'email', type: 'email', placeholder: 'john@example.com', required: true },
                                        { label: 'Phone Number', name: 'phone', type: 'tel', placeholder: '+91 98765 43210', required: false },
                                        { label: 'Resume / Portfolio Link', name: 'resume_link', type: 'url', placeholder: 'https://drive.google.com/...', required: false },
                                    ].map(({ label, name, type, placeholder, required }) => (
                                        <div key={name}>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                                            <input
                                                type={type}
                                                placeholder={placeholder}
                                                required={required}
                                                value={form[name]}
                                                onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3CAB] transition"
                                            />
                                        </div>
                                    ))}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
                                        <textarea
                                            rows={4}
                                            placeholder="Tell us about yourself, your experience, and why you'd like to join Vikrin…"
                                            value={form.cover_letter}
                                            onChange={e => setForm(f => ({ ...f, cover_letter: e.target.value }))}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3CAB] transition resize-none"
                                        />
                                    </div>

                                    {submitStatus === 'error' && (
                                        <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl">{errorMsg}</p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-[#1F3CAB] hover:bg-[#162d8a] text-white py-3 rounded-xl font-semibold transition disabled:opacity-60 flex items-center justify-center gap-2"
                                    >
                                        {submitting ? (
                                            <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting…</>
                                        ) : (
                                            <><Send className="w-4 h-4" /> Submit Application</>
                                        )}
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
