'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import MainLayout from '../Components/MainLayout'

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
  category: string | null  // تغییر به string | null
}

export default function BlogPosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchPosts()
  }, [selectedTag, selectedCategory])

  const fetchPosts = async () => {
    try {
      let query = supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (selectedTag) {
        query = query.contains('tags', [selectedTag])
      }

      if (selectedCategory) {
        query = query.eq('category', selectedCategory)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      // تبدیل URL تصاویر شاخص به URL کامل
      const postsWithImages = data?.map(post => {
        if (post.featured_image) {
          const { data: imageUrl } = supabase
            .storage
            .from('featured-images')
            .getPublicUrl(post.featured_image)
          return { ...post, featured_image: imageUrl.publicUrl }
        }
        return post
      }) || []

      setPosts(postsWithImages)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-500 p-4 rounded-lg">
        خطا در بارگذاری مطالب: {error}
      </div>
    )
  }

  // استخراج همه برچسب‌ها و موضوعات منحصر به فرد
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags || [])))
  const allCategories = Array.from(new Set(posts.map(post => post.category).filter((category): category is string => category !== null)))

  return (
    <MainLayout>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* فیلترها */}
      <div className="mb-8 flex flex-wrap gap-4">
        {allCategories.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">موضوعات:</h3>
            <div className="flex gap-2 flex-wrap">
              {allCategories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    category === selectedCategory
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {allTags.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">برچسب‌ها:</h3>
            <div className="flex gap-2 flex-wrap">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    tag === selectedTag
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* لیست پست‌ها */}
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
              
              {post.category && (
                <Link
                  href={`/blog/category/${post.category}`}
                  className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-2 hover:bg-blue-200"
                >
                  {post.category}
                </Link>
              )}
              
              <div className="flex flex-wrap gap-2 mt-3">
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
          هیچ نوشته‌ای یافت نشد.
        </div>
      )}
    </div>
    </MainLayout>
  )
}