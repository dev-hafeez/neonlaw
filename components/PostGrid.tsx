'use client';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import PostCard from './PostCard';
import { usePosts } from '@/lib/usePosts';

export default function PostGrid({ q='', cats=[] }: { q?: string; cats?: (string|number)[] }) {
  const { data, setSize, isLoading } = usePosts({ q, cats });
  const pages = data ?? [];
  const posts = pages.flatMap((p:any) => p.nodes ?? []);
  const { ref, inView } = useInView({ rootMargin: '300px' });

  useEffect(() => { if (inView) setSize(s => s + 1); }, [inView, setSize]);

  return (
    <>
      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((p:any) => <PostCard key={p.id} post={p} />)}
      </div>
      {isLoading && <div className="py-8 text-center opacity-70">Loading…</div>}
      <div ref={ref} className="h-1" />
    </>
  );
}