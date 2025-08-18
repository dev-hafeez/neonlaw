'use client';
import { useEffect, useState } from 'react';
import PostGrid from './PostGrid';
import CategoryChips from './CategoryChips';

export default function SearchOverlay({ categories }:{ categories:{name:string;databaseId:number}[] }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState<number[]>([]);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; }, [open]);
  const toggle = (id:number) => setActive(a => a.includes(id) ? a.filter(x=>x!==id) : [...a, id]);

  return (
    <>
      <button onClick={() => setOpen(true)} className="px-4 py-2 rounded-full bg-[#0a72bd] text-white">Search</button>
      {open && (
        <div className="fixed inset-0 bg-white/95 z-50 p-6 md:p-10 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <input
              autoFocus
              placeholder="Search…"
              value={q}
              onChange={e=>setQ(e.target.value)}
              className="w-full md:w-1/2 border rounded-xl px-4 py-3"
            />
            <button onClick={() => setOpen(false)} className="ml-3">✕</button>
          </div>

          <CategoryChips cats={categories} active={active} onToggle={toggle} />

          <PostGrid q={q} cats={active} />
        </div>
      )}
    </>
  );
}