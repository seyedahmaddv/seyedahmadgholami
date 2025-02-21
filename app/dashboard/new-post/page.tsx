'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { toast } from 'react-hot-toast'

const RTEditor = dynamic(() => import('../../Components/RTEditor'), {
  ssr: false,
  loading: () => <p>در حال بارگذاری ویرایشگر...</p>
})

export default function NewPost() {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [status, setStatus] = useState('draft')
  const [featuredImage, setFeaturedImage] = useState<File | null>(null)
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(null)
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
        toast.error('خطا در دریافت اطلاعات کاربر')
        return
      }
      setUser(currentUser)
    }
    getUser()
  }, [])

  // Generate slug from title
  useEffect(() => {
    if (title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
      setSlug(generatedSlug)
    }
  }, [title])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('حجم فایل باید کمتر از 10 مگابایت باشد')
        return
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif']
      if (!validTypes.includes(file.type)) {
        toast.error('فقط فرمت‌های PNG، JPG و GIF پشتیبانی می‌شوند')
        return
      }

      setFeaturedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setFeaturedImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (file: File) => {
    if (!user?.id) {
      throw new Error('کاربر احراز هویت نشده است')
    }

    const fileExt = file.name.split('.').pop()
    const uniqueId = Math.random().toString(36).substring(2)
    const fileName = `${uniqueId}.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    const { error: uploadError, data } = await supabase.storage
      .from('featured-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw new Error('خطا در آپلود تصویر')
    }

    return filePath
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error('لطفاً وارد حساب کاربری خود شوید')
      return
    }

    if (!title || !content) {
      toast.error('لطفاً عنوان و محتوا را وارد کنید')
      return
    }

    setLoading(true)
    setError(null)

    try {
      let featured_image = null
      if (featuredImage) {
        featured_image = await uploadImage(featuredImage)
      }

      const { error: insertError } = await supabase
        .from('posts')
        .insert([
          {
            title,
            content,
            slug,
            excerpt,
            status,
            featured_image,
            author_id: user.id,
            published_at: status === 'published' ? new Date().toISOString() : null
          }
        ])

      if (insertError) {
        console.error('Insert error:', insertError)
        throw new Error('خطا در ثبت پست')
      }

      toast.success('پست با موفقیت ایجاد شد')
      router.push('/dashboard/posts')
      router.refresh()
    } catch (e: any) {
      console.error('Error details:', e)
      toast.error(e.message || 'خطا در ایجاد پست')
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const file = e.dataTransfer.files?.[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        const changeEvent = {
          target: {
            files: [file]
          }
        } as unknown as React.ChangeEvent<HTMLInputElement>
        handleImageChange(changeEvent)
      } else {
        toast.error('لطفاً فقط فایل تصویری آپلود کنید')
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">نوشته جدید</h1>
      
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
          <div 
            className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
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
              <p className="text-xs leading-5 text-gray-600">PNG، JPG، GIF تا 10MB</p>
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