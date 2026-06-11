import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Calendar, User, ArrowLeft } from 'lucide-react';

const API_BASE = 'https://pink-echidna-330123.hostingersite.com/api';

export default function BlogPostDetail({ post, error }) {
    if (error || !post) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
                    <div className="max-w-md space-y-4">
                        <div className="text-5xl">⚠️</div>
                        <h1 className="text-2xl font-bold text-gray-800">Article Not Found</h1>
                        <p className="text-gray-500">The blog post you are looking for does not exist or has been removed.</p>
                        <Link href="/blog" className="inline-block bg-[#1F3CAB] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#162d8a] transition">
                            Back to Blog
                        </Link>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Head>
                <title>{post.title} – Vikrin Blog</title>
                <meta name="description" content={post.summary || post.title} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.summary} />
                {post.image_url && <meta property="og:image" content={post.image_url} />}
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />

            <main className="bg-[#f8fafc] min-h-screen py-12 px-6">
                <article className="max-w-3xl mx-auto bg-white rounded-3xl border border-gray-200/60 shadow-sm overflow-hidden">
                    {/* Header Image */}
                    {post.image_url && (
                        <div className="relative h-64 md:h-[400px] w-full bg-gray-100">
                            <Image 
                                src={post.image_url} 
                                alt={post.title} 
                                fill 
                                priority
                                className="object-cover" 
                            />
                        </div>
                    )}

                    <div className="p-6 md:p-12 space-y-6">
                        {/* Back navigation */}
                        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#1F3CAB] transition text-sm font-semibold">
                            <ArrowLeft className="w-4 h-4" /> Back to Articles
                        </Link>

                        {/* Title & Metadata */}
                        <div className="space-y-4">
                            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                                {post.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-semibold border-b border-gray-100 pb-6">
                                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(post.published_at).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {post.author}</span>
                            </div>
                        </div>

                        {/* Summary Block */}
                        {post.summary && (
                            <p className="text-lg text-gray-600 font-medium leading-relaxed italic border-l-4 border-[#1F3CAB] pl-4">
                                {post.summary}
                            </p>
                        )}

                        {/* Content Body */}
                        <div 
                            className="prose prose-blue max-w-none text-gray-800 leading-relaxed space-y-6 text-base whitespace-pre-line"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>
                </article>
            </main>

            <Footer />
        </>
    );
}

export async function getServerSideProps(context) {
    const { slug } = context.params;
    try {
        const res = await fetch(`${API_BASE}/blogs-get.php?slug=${slug}`);
        const data = await res.json();
        if (data.success) {
            return { props: { post: data.data } };
        }
    } catch {}
    
    return { props: { error: true } };
}
