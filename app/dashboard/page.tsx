import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: postsData, error } = await supabase
    .from('posts')
    .select('status')
    .eq('author_id', (await supabase.auth.getSession()).data.session?.user.id)

  if (error) {
    console.error('Error fetching stats:', error)
    return <div>Error loading dashboard stats</div>
  }

  const stats = {
    total: postsData?.length || 0,
    published: postsData?.filter(post => post.status === 'published').length || 0,
    draft: postsData?.filter(post => post.status === 'draft').length || 0
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">پیشخوان</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">کل نوشته‌ها</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">منتشر شده</h3>
          <p className="text-3xl font-bold text-green-600">{stats.published}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">پیش‌نویس</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.draft}</p>
        </div>
      </div>
    </div>
  )
}