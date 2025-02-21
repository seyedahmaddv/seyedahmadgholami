// utils/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // ایجاد کلاینت Supabase
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // تنظیم کوکی‌ها برای درخواست فعلی
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value, options)
          })

          // بروزرسانی پاسخ Supabase
          supabaseResponse = NextResponse.next({
            request,
          })

          // تنظیم کوکی‌ها برای پاسخ نهایی
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // تازه‌سازی توکن احراز هویت
  await supabase.auth.getSession()

  return supabaseResponse
}