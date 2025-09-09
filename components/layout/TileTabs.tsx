'use client';
import * as React from 'react';

type ImageNode = { node?: { sourceUrl: string; altText?: string | null } };
type Person = { slug: string; title: string; peopleFields?: { position?: string | null }; featuredImage?: ImageNode };
type Deal = { slug: string; title: string; excerpt?: string | null; featuredImage?: ImageNode };

type TabKey = 'all' | 'deals' | 'team';

interface Props {
  initial?: TabKey;
  content?: string | null;
  teamMembers?: Person[];
  deals?: Deal[];
  className?: string;
}

export default function TileTabs({
  initial = 'team',
  content,
  teamMembers = [],
  deals = [],
  className,
}: Props) {
  const [active, setActive] = React.useState<TabKey>(initial);

  const Tab = ({ id, children }: { id: TabKey; children: React.ReactNode }) => (
    <button
      type="button"
      onClick={() => setActive(id)}
      className={
        active === id
          ? 'uppercase text-sm font-medium tracking-wide text-[#0a72bd] border-b-2 border-[#0a72bd] pb-1'
          : 'uppercase text-sm font-medium tracking-wide text-gray-500 hover:text-[#0a72bd]'
      }
    >
      {children}
    </button>
  );

  const TeamGrid = () =>
    teamMembers.length ? (
      <section>
        <h2 className="text-2xl font-bold mb-4">Team</h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((p) => {
            const img = p.featuredImage?.node;
            return (
              <a key={p.slug} href={`/people/${p.slug}`} className="relative block group overflow-hidden rounded-xl">
                {img?.sourceUrl && (
                  <img
                    src={img.sourceUrl}
                    alt={img.altText || p.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  {p.peopleFields?.position && (
                    <p className="text-sm text-white/80 mb-1">{p.peopleFields.position}</p>
                  )}
                  <h3 className="text-lg font-semibold text-white">{p.title}</h3>
                </div>
              </a>
            );
          })}
        </div>
      </section>
    ) : (
      <p className="text-gray-600">No team members linked.</p>
    );

  const DealCard = ({ d }: { d: Deal }) => {
    const img = d.featuredImage?.node;
    return (
      <a href={`/tile/${d.slug}`} className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition">
        {img?.sourceUrl && (
          <img
            src={img.sourceUrl}
            alt={img.altText || d.title}
            className="w-24 h-24 object-cover rounded"
          />
        )}
        <div>
          <h3 className="font-semibold">{d.title}</h3>
          {d.excerpt && (
            <div
              className="text-sm text-gray-600 line-clamp-3"
              dangerouslySetInnerHTML={{ __html: d.excerpt }}
            />
          )}
        </div>
      </a>
    );
  };

  const DealsList = () =>
    deals.length ? (
      <section>
        <h2 className="text-2xl font-bold mb-4">Deals</h2>
        <div className="grid gap-4">
          {deals.map((d) => (
            <DealCard key={d.slug} d={d} />
          ))}
        </div>
      </section>
    ) : (
      <div className="text-gray-600">
        <p className="mb-2">No deals linked to this post yet.</p>
        <p className="text-sm">
          Add an ACF <strong>Relationship</strong> field named <code className="px-1">relatedDeals</code> (Show in GraphQL),
          then link one or more posts on this entry.
        </p>
      </div>
    );

  return (
    <div className={className}>
      <div className="flex justify-center gap-6 mb-6">
        <Tab id="all">All</Tab>
        <Tab id="deals">Deals</Tab>
        <Tab id="team">Team</Tab>
      </div>

      {active === 'all' && (
        <div className="space-y-10">
          <TeamGrid />
          <DealsList />
        </div>
      )}

      {active === 'deals' && <DealsList />}
      {active === 'team' && <TeamGrid />}
    </div>
  );
}
