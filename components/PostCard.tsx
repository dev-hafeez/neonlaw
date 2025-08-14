import Link from "next/link";
import Image from "next/image";

export default function PostCard({ post }: { post: any }) {
  const img = post?.featuredImage?.node;
  return (
    <Link href={`/post/${post.slug}`} className="block rounded-2xl border p-4 hover:shadow-md transition">
      {img?.sourceUrl && (
        <Image
          src={img.sourceUrl}
          alt={img.altText || post.title}
          width={img.mediaDetails?.width || 800}
          height={img.mediaDetails?.height || 500}
          className="rounded-xl w-full h-auto"
          sizes="(min-width: 1024px) 33vw, 100vw"
        />
      )}
      <h3 className="mt-3 font-semibold text-lg">{post.title}</h3>
      <div className="text-sm opacity-80" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
    </Link>
  );
}
