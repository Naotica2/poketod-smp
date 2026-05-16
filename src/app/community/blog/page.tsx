import { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, Calendar, ChevronRight, User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import blogData from '@/data/blog.json'

export const metadata: Metadata = {
  title: 'Blog - Poketod SMP',
  description: 'Latest news, updates, and announcements from Poketod SMP.',
}

function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

export default function BlogPage() {
  const posts = [...blogData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="mc-bg min-h-screen">
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-10 text-center">
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-mc-brass text-shadow mb-3">Server Blog</h1>
          <p className="text-dark-300 max-w-2xl mx-auto">
            Stay up to date with the latest news, updates, and announcements from the Poketod SMP team.
          </p>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="solid-card p-6 sm:p-8 flex flex-col group">
              <h2 className="font-heading font-bold text-2xl text-white mb-3 group-hover:text-mc-primary transition-colors">
                <Link href={`/community/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h2>
              
              <div className="flex items-center gap-4 text-xs font-bold text-dark-400 mb-4 pb-4 border-b border-dark-950">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {formatDate(post.date)}
                </span>
                <span className="flex items-center gap-1">
                  <User size={14} />
                  {post.author}
                </span>
              </div>
              
              <div className="text-dark-300 text-sm leading-relaxed mb-6 flex-1 font-sans">
                <ReactMarkdown
                  components={{
                    p: ({node, ...props}) => <p className="inline" {...props} />,
                    strong: ({node, ...props}) => <strong className="text-mc-primary font-bold" {...props} />
                  }}
                >
                  {post.excerpt}
                </ReactMarkdown>
              </div>
              
              <div className="flex justify-end">
                <Link href={`/community/blog/${post.slug}`} className="btn-primary text-sm flex items-center gap-2">
                  Read More <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ))}

          {posts.length === 0 && (
            <div className="solid-card p-8 text-center text-dark-400">
              <p>No blog posts found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
