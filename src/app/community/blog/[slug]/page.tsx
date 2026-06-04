import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, BookOpen } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import blogData from '@/data/blog.json'


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = blogData.find((p) => p.slug === slug)
  if (!post) return { title: 'Not Found - Poketod SMP' }
  
  return {
    title: `${post.title} - Poketod SMP Blog`,
    description: post.excerpt,
  }
}

function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = blogData.find((p) => p.slug === slug)
  
  if (!post) {
    notFound()
  }

  return (
    <div className="mc-bg min-h-screen">
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Link href="/community/blog" className="inline-flex items-center gap-2 text-dark-300 hover:text-white mb-8 font-bold transition-colors">
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        <article className="solid-card p-6 sm:p-10">
          <div className="mb-8 pb-8 border-b-4 border-dark-950">
            <h1 className="font-heading font-bold text-3xl sm:text-4xl text-white text-shadow mb-4 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-xs font-bold text-dark-400">
              <span className="flex items-center gap-1">
                <Calendar size={14} className="text-mc-primary" />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-1">
                <User size={14} className="text-mc-primary" />
                {post.author}
              </span>
            </div>
          </div>

          <div className="max-w-none whitespace-pre-wrap leading-relaxed mt-8">
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h1 className="text-3xl font-heading font-bold text-white mt-8 mb-4" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl font-heading font-bold text-white mt-8 mb-4 border-b-2 border-dark-950 pb-2" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-heading font-bold text-white mt-6 mb-3" {...props} />,
                p: ({node, ...props}) => <p className="text-dark-300 font-sans mb-4 leading-relaxed" {...props} />,
                strong: ({node, ...props}) => <strong className="text-mc-primary font-bold" {...props} />,
                a: ({node, ...props}) => <a className="text-mc-primary hover:underline font-semibold" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 text-dark-300" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 text-dark-300" {...props} />,
                li: ({node, ...props}) => <li className="mb-1" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-mc-primary pl-4 italic text-dark-400 my-4" {...props} />,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>

        <div className="mt-8 solid-panel p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BookOpen size={24} className="text-mc-brass" />
            <div>
              <p className="font-heading font-bold text-white text-shadow">Enjoyed this update?</p>
              <p className="text-sm text-dark-400 font-bold">Join our Discord to discuss it with the community!</p>
            </div>
          </div>
          <a href="https://discord.gg/uEqdGs6w6F" target="_blank" rel="noopener noreferrer" className="btn-ghost shrink-0">
            Join Discord
          </a>
        </div>
      </div>
    </div>
  )
}
