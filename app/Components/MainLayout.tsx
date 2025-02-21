import Link from 'next/link'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* نوار منو */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold text-gray-900">
                  لوگو
                </Link>
              </div>
              <div className="hidden sm:flex sm:space-x-8 sm:space-x-reverse mr-8">
                <Link
                  href="/"
                  className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-gray-600"
                >
                  صفحه اصلی
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-gray-600"
                >
                  وبلاگ
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-gray-600"
                >
                  درباره ما
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* محتوای اصلی */}
      <main className="bg-gray-50 min-h-[calc(100vh-4rem)]">
        {children}
      </main>

      {/* فوتر */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">
            تمامی حقوق محفوظ است © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  )
}