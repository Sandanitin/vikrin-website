import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Search, ArrowRight, Loader2 } from 'lucide-react';

const API_BASE = 'https://pink-echidna-330123.hostingersite.com/api';

export default function BlogIndex() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetch(`${API_BASE}/blogs-get.php`)
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    setPosts(data.data);
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(search.toLowerCase()) || 
        post.summary.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <Head>
                <title>Blog – Insights, News & Tips | Vikrin</title>
                <meta name="description" content="Read our latest blog posts about web development, digital marketing strategies, technology trends, and industry insights." />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />

            <main className="bg-[#f8fafc] min-h-screen">
                {/* Hero */}
                <section className="relative py-20 px-6 bg-[#042927] text-white text-center overflow-hidden">
                    <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
                    <div className="max-w-4xl mx-auto relative z-10 space-y-6">
                        <span className="inline-block bg-green-500/10 text-green-400 font-semibold tracking-widest uppercase text-xs px-3 py-1.5 rounded-full border border-green-500/20">
                            Vikrin Blog
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                            Insights & <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">Perspectives</span>
                        </h1>
                        <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            Stay up-to-date with our latest technical guides, marketing case studies, design tips, and digital business ideas.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-md mx-auto pt-4 relative">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                                <Search className="w-5 h-5" />
                            </div>
                            <input 
                                type="text"
                                placeholder="Search articles..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                            />
                        </div>
                    </div>
                </section>

                {/* Blog Grid */}
                <section className="max-w-6xl mx-auto px-6 py-16">
                    {loading && (
                        <div className="text-center py-20">
                            <Loader2 className="w-10 h-10 animate-spin text-[#1F3CAB] mx-auto" />
                            <p className="mt-4 text-gray-500 font-medium">Loading articles…</p>
                        </div>
                    )}

                    {!loading && filteredPosts.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                            <div className="text-5xl mb-4">🔍</div>
                            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Articles Found</h3>
                            <p className="text-gray-500">We couldn&apos;t find any posts matching your search query. Try another keyword!</p>
                        </div>
                    )}

                    {!loading && filteredPosts.length > 0 && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPosts.map((post, idx) => (
                                <motion.article 
                                    key={post.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                                    className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between overflow-hidden group"
                                >
                                    <div>
                                        {/* Thumbnail Image */}
                                        <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                                            <Image 
                                                src={post.image_url || '/careers_hero.png'} 
                                                alt={post.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                                className="object-cover group-hover:scale-105 transition duration-500"
                                            />
                                        </div>

                                        <div className="p-6 space-y-3">
                                            <div className="flex items-center gap-4 text-xs text-gray-500 font-semibold">
                                                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(post.published_at).toLocaleDateString()}</span>
                                                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {post.author}</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition line-clamp-2">
                                                {post.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                                                {post.summary}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-6 pt-0">
                                        <Link href={`/blog/post?slug=${post.slug}`} className="inline-flex items-center gap-2 text-[#1F3CAB] font-bold hover:gap-3 transition duration-150 text-sm">
                                            Read Full Article <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </>
    );
}
