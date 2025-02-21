import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white md:h-screen md:sticky md:top-0">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">داشبورد</h2>
          <p className="text-gray-700 mt-2">{profile?.full_name}</p>
        </div>
        
        <nav className="mt-6 px-4">
          <Link 
            href="/dashboard" 
            className="block px-4 py-3 mb-2 text-gray-800 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
          >
            پیشخوان
          </Link>
          <Link 
            href="/dashboard/posts" 
            className="block px-4 py-3 mb-2 text-gray-800 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
          >
            نوشته‌ها
          </Link>
          <Link 
            href="/dashboard/new-post" 
            className="block px-4 py-3 mb-2 text-gray-800 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
          >
            نوشته جدید
          </Link>
          <Link 
            href="/dashboard/profile" 
            className="block px-4 py-3 mb-2 text-gray-800 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
          >
            پروفایل
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}