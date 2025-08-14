'use client';
export default function CategoryChips({ cats, active, onToggle }:{
  cats: { name:string; databaseId:number }[];
  active: number[];
  onToggle: (id:number)=>void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {cats.map(c => {
        const on = active.includes(c.databaseId);
        return (
          <button
            key={c.databaseId}
            onClick={() => onToggle(c.databaseId)}
            className={`px-3 py-1 rounded-full border ${on ? 'bg-[#0a72bd] text-white' : 'bg-white'}`}
          >
            {c.name}
          </button>
        );
      })}
    </div>
  );
}