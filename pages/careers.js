import Head from 'next/head';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Briefcase, ChevronDown, ChevronUp, Send, X, CheckCircle } from 'lucide-react';

const API_BASE = 'https://pink-echidna-330123.hostingersite.com/api';

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

            <main className="bg-[#f8fafc] min-h-screen">
                {/* Hero */}
                <section className="relative py-24 px-6 md:px-12 bg-[#042927] text-white overflow-hidden">
                    <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>
                    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            transition={{ duration: 0.6 }}
                            className="space-y-6 text-left"
                        >
                            <span className="inline-block bg-green-500/10 text-green-400 font-semibold tracking-widest uppercase text-xs px-3 py-1.5 rounded-full border border-green-500/20">
                                🚀 We&apos;re Hiring
                            </span>
                            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                                Build the Future <br />
                                <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">with Vikrin</span>
                            </h1>
                            <p className="text-white/80 text-lg md:text-xl leading-relaxed">
                                Join a high-performance team that crafts world-class websites and drives growth with cutting-edge digital marketing. Remote-friendly, innovation-led, and growth-focused.
                            </p>
                            <div className="pt-2">
                                <a 
                                    href="#open-positions" 
                                    className="inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-3.5 rounded-xl font-bold transition transform hover:scale-105 shadow-lg shadow-green-500/20"
                                >
                                    View Open Positions
                                </a>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex justify-center"
                        >
                            <div className="relative w-full h-[320px] md:h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                                <Image
                                    src="/careers_hero.png"
                                    alt="Vikrin Team Collaboration"
                                    fill
                                    priority
                                    className="object-cover transform group-hover:scale-105 transition duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#042927]/60 via-transparent to-transparent pointer-events-none" />
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Why Work With Us */}
                <section className="pt-20 pb-10 px-6 max-w-6xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-[#1F3CAB] tracking-tight mb-4">
                            Why Join Vikrin?
                        </h2>
                        <p className="text-gray-600 text-lg">
                            We believe in fostering an environment where talented professionals can perform at their best and continuously grow.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { src: '/careers_fast_growth.png', title: 'Fast Growth', desc: 'Accelerate your career with real ownership, autonomy, and impact on global client projects.' },
                            { src: '/careers_remote_first.png', title: 'Remote-First', desc: 'Work from anywhere in the world. We embrace flexible schedules and an asynchronous, document-first culture.' },
                            { src: '/careers_learn_grow.png', title: 'Learn & Grow', desc: 'Access continuous mentorship, skills training, and exposure to cutting-edge web & marketing tech.' },
                        ].map(({ src, title, desc }, index) => (
                            <motion.div 
                                key={title} 
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden mb-6 border border-gray-100 shadow-sm">
                                        <Image
                                            src={src}
                                            alt={title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                                    <p className="text-gray-600 leading-relaxed text-sm">{desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Job Listings */}
                <section id="open-positions" className="pt-0 pb-16 px-6 max-w-6xl mx-auto scroll-mt-24">
                    <div className="border-t border-gray-200/80 pt-10 mb-12 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-4 max-w-xl">
                            <span className="text-blue-600 font-bold tracking-wider uppercase text-xs block">Join Our Mission</span>
                            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Open Positions</h2>
                            <p className="text-gray-600 text-base leading-relaxed">
                                Discover career opportunities. If you don&apos;t see a perfect match, feel free to send us your resume anyway!
                            </p>
                        </div>
                        <div className="relative w-40 h-40 md:w-48 md:h-48 shrink-0 rounded-3xl overflow-hidden border border-gray-100 shadow-sm bg-white">
                            <Image
                                src="/careers_hiring_illustration.png"
                                alt="We are hiring illustration"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

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

                    <div className="space-y-6">
                        {jobs.map((job, i) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.05 }}
                                className="bg-white rounded-3xl border border-gray-200/60 shadow-sm hover:shadow-md transition duration-200 overflow-hidden"
                            >
                                <button
                                    onClick={() => setExpandedId(expandedId === job.id ? null : job.id)}
                                    className="w-full text-left p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 focus:outline-none hover:bg-gray-50/50 transition duration-150 group"
                                >
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition">{job.title}</h3>
                                        <div className="flex flex-wrap gap-2.5 mt-2.5 text-xs font-semibold">
                                            {job.department && (
                                                <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                                                    <Briefcase className="w-3.5 h-3.5" /> {job.department}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-full">
                                                <MapPin className="w-3.5 h-3.5" /> {job.location}
                                            </span>
                                            <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full">
                                                <Clock className="w-3.5 h-3.5" /> {job.type}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 shrink-0 self-start sm:self-auto">
                                        <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Hiring</span>
                                        <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-[#1F3CAB] group-hover:bg-blue-50/50 transition">
                                            {expandedId === job.id ? <ChevronUp className="w-5 h-5 text-[#1F3CAB]" /> : <ChevronDown className="w-5 h-5" />}
                                        </div>
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
                                            <div className="px-6 pb-8 sm:px-8 border-t border-gray-100 pt-6 space-y-6 bg-gray-50/20">
                                                <div className="grid md:grid-cols-3 gap-6">
                                                    <div className="md:col-span-2 space-y-4">
                                                        <div>
                                                            <h4 className="font-bold text-gray-800 text-base mb-2">About This Role</h4>
                                                            <p className="text-gray-600 whitespace-pre-line text-sm leading-relaxed">{job.description}</p>
                                                        </div>
                                                        {job.requirements && (
                                                            <div>
                                                                <h4 className="font-bold text-gray-800 text-base mb-2">Requirements</h4>
                                                                <p className="text-gray-600 whitespace-pre-line text-sm leading-relaxed">{job.requirements}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="bg-white p-6 rounded-2xl border border-gray-200/50 shadow-sm flex flex-col justify-center h-fit space-y-4">
                                                        <h5 className="font-bold text-gray-900 text-sm">Ready to apply?</h5>
                                                        <p className="text-gray-500 text-xs leading-relaxed">Submit your details and we will review your application within 3 business days.</p>
                                                        <button
                                                            onClick={() => openApply(job)}
                                                            className="w-full inline-flex items-center justify-center gap-2 bg-[#1F3CAB] hover:bg-[#162d8a] text-white px-5 py-3 rounded-xl font-bold transition hover:scale-[1.02] active:scale-95 shadow-md shadow-blue-600/10"
                                                        >
                                                            <Send className="w-4 h-4" /> Apply Now
                                                        </button>
                                                    </div>
                                                </div>
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
