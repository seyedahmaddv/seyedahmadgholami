'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Post {
  id: string
  title: string
  content: string
  excerpt: string
  slug: string
  featured_image: string | null
  status: string
  created_at: string
  tags?: string[]
  category?: string
}

export default function CategoryPosts({ params }: { params: { category: string } }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('posts')
          .select('*')
          .eq('category', decodeURIComponent(params.category))
          .eq('status', 'published')
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError

        setPosts(data || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [params.category])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          خطا در بارگذاری مطالب: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          نوشته‌های موضوع «{decodeURIComponent(params.category)}»
        </h1>
        <p className="text-gray-600 mt-2">
          {posts.length} نوشته
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map(post => (
          <article
            key={post.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {post.featured_image && (
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="object-cover w-full h-48"
                />
              </div>
            )}
            <div className="p-6">
              <Link
                href={`/blog/${post.slug}`}
                className="text-xl font-bold text-gray-900 hover:text-blue-600 mb-2 block"
              >
                {post.title}
              </Link>
              
              <p className="text-gray-600 mb-4 line-clamp-3">
                {post.excerpt || post.content.substring(0, 150) + '...'}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags?.map(tag => (
                  <Link
                    key={tag}
                    href={`/blog/tag/${tag}`}
                    className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full hover:bg-gray-200"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
              
              <div className="mt-4 text-sm text-gray-500">
                {new Date(post.created_at).toLocaleDateString('fa-IR')}
              </div>
            </div>
          </article>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          هیچ نوشته‌ای در این موضوع یافت نشد.
        </div>
      )}
    </div>
  )
}