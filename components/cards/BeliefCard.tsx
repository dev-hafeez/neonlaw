import Link from "next/link";

type Props = {
  href: string;
  prefix?: string | null;
  title: string;
  image?: string | null;
  alt?: string | null;
};

export default function BeliefCard({ href, prefix, title, image, alt }: Props) {
  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {image ? (
        <img
          src={image}
          alt={alt || title}
          className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      ) : (
        <div className="h-72 w-full bg-gradient-to-br from-gray-200 to-gray-300" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-6 left-6 right-6 text-white">
        {prefix && (
          <p className="text-sm font-medium opacity-90 mb-2 tracking-wide uppercase">
            {prefix}
          </p>
        )}
        <h3 className="text-xl font-bold leading-tight tracking-tight">
          {title}
        </h3>
      </div>
    </Link>
  );
}
