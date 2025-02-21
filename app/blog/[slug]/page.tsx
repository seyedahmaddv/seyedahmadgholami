'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import MainLayout from '../../Components/MainLayout'

interface Profile {
  id: string
  username?: string
  full_name?: string
}

interface Post {
  id: string
  title: string
  content: string
  featured_image: string | null
  status: string
  created_at: string
  tags?: string[]
  category?: string
  author?: Profile
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('posts')
          .select(`
            *,
            author:author_id (
              id,
              username,
              full_name
            )
          `)
          .eq('slug', params.slug)
          .eq('status', 'published')
          .single()

        if (fetchError) throw fetchError

        if (!data) {
          throw new Error('نوشته مورد نظر یافت نشد')
        }

        if (data.featured_image) {
          const { data: imageUrl } = supabase
            .storage
            .from('featured-images')
            .getPublicUrl(data.featured_image)
          data.featured_image = imageUrl.publicUrl
        }

        setPost(data)
      } catch (err: any) {
        console.error('Error fetching post:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [params.slug])

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </MainLayout>
    )
  }

  if (error || !post) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-red-50 text-red-500 p-4 rounded-lg">
            {error || 'نوشته مورد نظر یافت نشد'}
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600">صفحه اصلی</Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-blue-600">وبلاگ</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{post.title}</span>
        </div>

        <article>
          <header className="mb-8">
            {post.featured_image && (
              <div className="aspect-video mb-6 rounded-lg overflow-hidden">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <time dateTime={post.created_at}>
                {new Date(post.created_at).toLocaleDateString('fa-IR')}
              </time>
              {post.author?.full_name && (
                <span>نویسنده: {post.author.full_name}</span>
              )}
              {!post.author?.full_name && post.author?.username && (
                <span>نویسنده: {post.author.username}</span>
              )}
            </div>
          </header>

          <div 
            className="prose prose-lg max-w-none mb-8 prose-h2:text-gray-900 prose-p:text-gray-700"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />

          <footer className="border-t pt-6 mt-8">
            <div className="flex flex-wrap gap-4">
              {post.category && (
                <div>
                  <span className="text-gray-600">موضوع: </span>
                  <Link
                    href={`/blog/category/${post.category}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {post.category}
                  </Link>
                </div>
              )}

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-gray-600">برچسب‌ها: </span>
                  {post.tags.map(tag => (
                    <Link
                      key={tag}
                      href={`/blog/tag/${tag}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </footer>
        </article>

        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            بازگشت به وبلاگ
          </Link>
        </div>
      </div>
    </MainLayout>
  )
}