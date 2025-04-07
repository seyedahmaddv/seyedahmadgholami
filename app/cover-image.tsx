import ContentfulImage from "../lib/contentful-image";
import Link from "next/link";

function cn(...classes: (string | boolean | undefined | Record<string, string | boolean | undefined>)[]): string {
  return classes
    .filter(Boolean)
    .map(item => {
      if (typeof item === 'object' && item !== null) {
        return Object.entries(item)
          .filter(([_, value]) => Boolean(value))
          .map(([key]) => key)
          .join(' ');
      }
      return item;
    })
    .filter(Boolean)
    .join(' ');
}
interface CoverImageProps {
  title: string;
  url: string;
  slug?: string;
}
export default function CoverImage({ title, url, slug }: CoverImageProps) {
  const image = (
    <ContentfulImage
      alt={`Cover Image for ${title}`}
      priority
      width={2000}
      height={1000}
      className={cn("shadow-small", {
        "hover:shadow-medium transition-shadow duration-200": slug,
      })}
      src={url}
    />
  );

  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link href={`/posts/${slug}`} aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  );
}
