'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'

const RTEditor = dynamic(() => import('../../../../Components/RTEditor'), {
    
  ssr: false,
  loading: () => <p>در حال بارگذاری ویرایشگر...</p>
})

export default function EditPost({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [status, setStatus] = useState('draft')
  const [featuredImage, setFeaturedImage] = useState<File | null>(null)
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(null)
  const [currentImagePath, setCurrentImagePath] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user: currentUser }, error } = await supabase.auth.getUser()
      if (error) {
        console.error('Error fetching user:', error)
        return
      }
      setUser(currentUser)
    }
    getUser()
  }, [])

  useEffect(() => {
    const fetchPost = async () => {
      const { data: post, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) {
        setError('خطا در بارگذاری پست')
        return
      }

      if (post) {
        setTitle(post.title)
        setSlug(post.slug)
        setContent(post.content)
        setExcerpt(post.excerpt)
        setStatus(post.status)
        setCurrentImagePath(post.featured_image)

        if (post.featured_image) {
          const { data } = await supabase.storage
            .from('featured-images')
            .getPublicUrl(post.featured_image)
          setFeaturedImagePreview(data.publicUrl)
        }
      }
    }

    fetchPost()
  }, [params.id])

  // Generate slug from title
  useEffect(() => {
    const generatedSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
    setSlug(generatedSlug)
  }, [title])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFeaturedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setFeaturedImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('featured-images')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    return filePath
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError('لطفاً وارد حساب کاربری خود شوید')
      return
    }

    setLoading(true)
    setError(null)

    try {
      let featured_image = currentImagePath
      if (featuredImage) {
        // اگر تصویر قبلی وجود دارد، آن را حذف کنید
        if (currentImagePath) {
          await supabase.storage
            .from('featured-images')
            .remove([currentImagePath])
        }
        featured_image = await uploadImage(featuredImage)
      }

      const { error: updateError } = await supabase
        .from('posts')
        .update({
          title,
          content,
          slug,
          excerpt,
          status,
          featured_image,
          updated_at: new Date().toISOString(),
          published_at: status === 'published' ? new Date().toISOString() : null
        })
        .eq('id', params.id)

      if (updateError) throw updateError

      router.push('/dashboard/posts')
      router.refresh()
    } catch (e: any) {
      console.error('Error details:', e)
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">ویرایش نوشته</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-bold text-gray-900 mb-2">
            عنوان
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-bold text-gray-900 mb-2">
            اسلاگ
          </label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-bold text-gray-900 mb-2">
            خلاصه
          </label>
          <textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            تصویر شاخص
          </label>
          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
            <div className="text-center">
              {featuredImagePreview ? (
                <div className="mb-4">
                  <img
                    src={featuredImagePreview}
                    alt="Preview"
                    className="mx-auto h-32 w-auto object-cover"
                  />
                </div>
              ) : (
                <div className="mx-auto h-12 w-12 text-gray-300">
                  <svg className="h-12 w-12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              )}
              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                >
                  <span>آپلود فایل</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImageChange}
                  />
                </label>
                <p className="pr-3">یا بکشید و رها کنید</p>
              </div>
              <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF تا 10MB</p>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-bold text-gray-900 mb-2">
            محتوا
          </label>
          <RTEditor
            value={content}
            onChange={setContent}
            className="min-h-[400px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-bold text-gray-900 mb-2">
            وضعیت
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="draft">پیش‌نویس</option>
            <option value="published">انتشار</option>
          </select>
        </div>

        <div className="flex justify-end space-x-4 space-x-reverse">
          <button
            type="button"
            onClick={() => router.push('/dashboard/posts')}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            انصراف
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'در حال ذخیره...' : 'ذخیره'}
          </button>
        </div>
      </form>
    </div>
  )
}