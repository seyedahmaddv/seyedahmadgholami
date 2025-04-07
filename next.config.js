/** @type {import('next').NextConfig} */
const nextConfig = {
    // تنظیمات موجود شما
    reactStrictMode: true,
    images: {
      domains: ['images.ctfassets.net'], // اگر از contentful استفاده می‌کنید
    },
    env: {
      // فعال کردن پشتیبانی از فرم‌های نتلیفی
      NETLIFY_NEXT_FORMS_SUPPORT: "true"
    }
  };
  
  module.exports = nextConfig;