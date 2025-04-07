import Link from "next/link";
import { draftMode } from "next/headers";
import RTLlayout from "@/app/Components/RTLlayout";
import MoreStories from "../../more-stories";
import Avatar from "../../avatar";
import Date from "../../date";
import CoverImage from "../../cover-image";

import { Markdown } from "@/lib/markdown";
import { getAllPosts, getPostAndMorePosts } from "@/lib/api";
import NewsletterForm from "@/app/Components/NewsletterForm";

export async function generateStaticParams() {
    const allPosts = await getAllPosts(false);
    if (!allPosts || !Array.isArray(allPosts)) {
        console.error('داده‌های پست در دسترس نیست یا معتبر نیست');
        return [];
    }
    return allPosts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function PostPage({
    params,
}: {
    params: { slug: string };
}) {
    const { isEnabled } = draftMode();
    const { post, morePosts } = await getPostAndMorePosts(params.slug, isEnabled);
    // اگر پست وجود نداشت، می‌توانید یک صفحه خطا یا صفحه جایگزین نمایش دهید
    if (!post) {
        return (
            <RTLlayout>
                <div className="container mx-auto px-5">
                    <h2 className="mb-20 mt-8 text-2xl font-bold leading-tight tracking-tight md:text-4xl md:tracking-tighter">
                        <Link href="/" className="hover:underline">
                            وبلاگ
                        </Link>
                        .
                    </h2>
                    <p>مطلب مورد نظر یافت نشد.</p>
                </div>
            </RTLlayout>
        );
    }
    return (
        <RTLlayout>
            <div className="container mx-auto px-5">
                <h2 className="mb-20 mt-8 text-2xl font-bold leading-tight tracking-tight md:text-4xl md:tracking-tighter">
                    <Link href="/" className="hover:underline">
                        وبلاگ
                    </Link>
                    .
                </h2>

                {/* استفاده از flex برای چیدمان سایدبار و محتوا */}
                <div className="flex flex-col md:flex-row md:gap-8">
                    {/* ستون اصلی محتوا */}
                    <div className="md:w-2/3 lg:w-3/4 order-2 md:order-1">
                        <article>
                            <h1 className="mb-12 text-center text-6xl font-bold leading-tight tracking-tighter md:text-right md:text-7xl md:leading-none lg:text-5xl">
                                {post.title}
                            </h1>
                            <div className="hidden md:mb-12 md:block">
                                {post.author && (
                                    <Avatar name={post.author.name} picture={post.author.picture} />
                                )}
                            </div>
                            <div className="mb-8 sm:mx-0 md:mb-16">
                                <CoverImage title={post.title} url={post.coverImage.url} />
                            </div>
                            <div className="mb-6 block md:hidden">
                                {post.author && (
                                    <Avatar name={post.author.name} picture={post.author.picture} />
                                )}
                            </div>
                            <div className="mb-6 text-lg">
                                <Date dateString={post.date} />
                            </div>

                            <div className="w-full">
                                <div className="prose lg:prose-xl max-w-none">
                                    <Markdown content={post.content} />
                                </div>
                            </div>
                        </article>
                    </div>

                    {/* سایدبار */}
                    <div className="md:w-1/3 lg:w-1/4 order-1 md:order-2 mb-8 md:mb-0">
                        <div className="bg-gray-100 p-4 rounded sticky top-8">
                            <h3 className="text-xl font-bold mb-4">مطالب مرتبط</h3>
                            <ul className="space-y-2">
                                {/* نمونه لینک‌های مرتبط */}
                                <li><a href="https://zil.ink/seyedahmaddev" className="hover:underline" target="_blank">مشاوره و سفارش طراحی سایت</a></li>
                                <li><a href="https://virgool.io/@seyedahmaddv" className="hover:underline" target="_blank">وبلاگ من در ویرگول</a></li>
                                <li><a href="https://www.linkedin.com/in/seyedahmaddv" className="hover:underline" target="_blank">پروفایل من در لینکدین</a></li>
                            </ul>

                            <h3 className="text-xl font-bold mt-6 mb-4">دسته‌بندی‌ها</h3>
                            <div className="flex flex-wrap gap-2">
                                <a href="#" className="bg-blue-100 px-2 py-1 rounded hover:bg-blue-200">دسته 1</a>
                                <a href="#" className="bg-blue-100 px-2 py-1 rounded hover:bg-blue-200">دسته 2</a>
                                <a href="#" className="bg-blue-100 px-2 py-1 rounded hover:bg-blue-200">دسته 3</a>
                            </div>

                            {/* محتوای دیگر سایدبار */}

                            <div className="mt-8">
                                <NewsletterForm />
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="border-accent-2 mt-28 mb-24" />
                {morePosts && morePosts.length > 0 && <MoreStories morePosts={morePosts} />}
            </div>
        </RTLlayout>
    );
}
