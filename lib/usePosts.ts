import useSWRInfinite from 'swr/infinite';
import { fetcher } from './fetcher';

const PAGE = 9;

type PostsPage = {
  pageInfo: { endCursor: string | null; hasNextPage: boolean };
};

export function usePosts({ q = '', cats = [] as Array<string | number> } = {}) {
  return useSWRInfinite<PostsPage>(
    (index: number, prev: PostsPage | null) => {
      if (prev && prev.pageInfo && !prev.pageInfo.hasNextPage) return null;
      const cursor = index && prev?.pageInfo?.endCursor ? `&cursor=${encodeURIComponent(prev.pageInfo.endCursor)}` : '';
      const cat = cats.map(c => `&cat=${c}`).join('');
      const search = q ? `&q=${encodeURIComponent(q)}` : '';
      return `/api/posts?limit=${PAGE}${cat}${search}${cursor}`;
    },
    fetcher,
    { revalidateFirstPage: false }
  );
}