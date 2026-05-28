'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { whatsappLink } from '@/lib/constants';
import { useSettings } from '@/components/SettingsProvider';

interface BlogListClientProps {
  initialBlogs: any[];
  locations: any[];
}

export function BlogListClient({ initialBlogs = [], locations = [] }: BlogListClientProps) {
  const { settings } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeLocationId, setActiveLocationId] = useState<string | null>(null);

  // Dynamic categories calculation based on current loaded blogs
  const categories = Array.from(new Set(initialBlogs.map(post => post.category))).map(catName => {
    return {
      name: catName,
      count: initialBlogs.filter(p => p.category === catName).length
    };
  });

  // Filter logic
  const filteredPosts = initialBlogs.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory ? post.category === activeCategory : true;
    
    let matchesLocation = true;
    if (activeLocationId === 'global') {
      matchesLocation = !post.location_id;
    } else if (activeLocationId !== null) {
      matchesLocation = post.location_id === activeLocationId;
    }
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div className="flex-grow max-w-7xl mx-auto px-6 lg:px-8 py-20 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12">
        {/* Articles Grid */}
        <div className="space-y-12">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPosts.map((article) => (
                <article key={article.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
                  <Link href={`/blog/${article.slug}`} className="block aspect-[16/10] overflow-hidden relative">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-[#1152d4]">
                        {article.category}
                      </div>
                      {article.locations && (
                        <div className="bg-[#E89B10]/95 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-white flex items-center gap-1 shadow-sm">
                          <span className="material-symbols-outlined text-[12px] font-bold">location_on</span>
                          {article.locations.name}
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-6 md:p-8 flex flex-col flex-grow">
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">{article.date}</p>
                    <Link href={`/blog/${article.slug}`}>
                      <h2 className="text-xl font-bold text-[#0B1F3A] mb-3 group-hover:text-[#1152d4] transition-colors line-clamp-2">
                        {article.title}
                      </h2>
                    </Link>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="mt-auto">
                      <Link href={`/blog/${article.slug}`} className="inline-flex items-center gap-2 text-[#E89B10] font-bold text-sm hover:gap-3 transition-all">
                        Read Full Article <span className="material-symbols-outlined text-lg">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold text-gray-400">No articles found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search, category, or location filters.</p>
              <button 
                onClick={() => { setSearchQuery(''); setActiveCategory(null); setActiveLocationId(null); }}
                className="mt-6 font-semibold text-[#1152d4]"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          {/* Search */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-[#0B1F3A] mb-4">Search Articles</h3>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#0B1F3A] outline-none"
              />
            </div>
          </div>

          {/* Cities / Locations */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-[#0B1F3A] mb-4 flex items-center justify-between">
              Filter by City
              <span className="material-symbols-outlined text-gray-300">location_on</span>
            </h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => setActiveLocationId(null)} 
                  className={`w-full flex items-center justify-between group ${activeLocationId === null ? 'text-[#1152d4] font-bold' : 'text-gray-500 font-medium'}`}
                >
                  <span className="group-hover:text-[#1152d4] transition-colors">All Cities</span>
                  <span className="bg-gray-50 text-gray-400 text-xs px-2 py-1 rounded-lg transition-colors">
                    {initialBlogs.length}
                  </span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveLocationId('global')} 
                  className={`w-full flex items-center justify-between group ${activeLocationId === 'global' ? 'text-[#1152d4] font-bold' : 'text-gray-500 font-medium'}`}
                >
                  <span className="group-hover:text-[#1152d4] transition-colors">General / Global</span>
                  <span className="bg-gray-50 text-gray-400 text-xs px-2 py-1 rounded-lg transition-colors">
                    {initialBlogs.filter(p => !p.location_id).length}
                  </span>
                </button>
              </li>
              {locations.map((loc) => {
                const count = initialBlogs.filter(p => p.location_id === loc.id).length;
                return (
                  <li key={loc.id}>
                    <button 
                      onClick={() => setActiveLocationId(loc.id)}
                      className={`w-full flex items-center justify-between group ${activeLocationId === loc.id ? 'text-[#1152d4] font-bold' : 'text-gray-500 font-medium'}`}
                    >
                      <span className="group-hover:text-[#1152d4] transition-colors">{loc.name}</span>
                      <span className="bg-gray-50 text-gray-400 text-xs px-2 py-1 rounded-lg group-hover:bg-[#1152d4]/10 group-hover:text-[#1152d4] transition-colors">
                        {count}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Categories */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-[#0B1F3A] mb-4 flex items-center justify-between">
              Categories
              <span className="material-symbols-outlined text-gray-300">category</span>
            </h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => setActiveCategory(null)} 
                  className={`w-full flex items-center justify-between group ${!activeCategory ? 'text-[#1152d4] font-bold' : 'text-gray-500 font-medium'}`}
                >
                  <span className="group-hover:text-[#1152d4] transition-colors">All Categories</span>
                  <span className="bg-gray-50 text-gray-400 text-xs px-2 py-1 rounded-lg transition-colors">{initialBlogs.length}</span>
                </button>
              </li>
              {categories.map((cat, i) => (
                <li key={i}>
                  <button 
                    onClick={() => setActiveCategory(cat.name)}
                    className={`w-full flex items-center justify-between group ${activeCategory === cat.name ? 'text-[#1152d4] font-bold' : 'text-gray-500 font-medium'}`}
                  >
                    <span className="group-hover:text-[#1152d4] transition-colors">{cat.name}</span>
                    <span className="bg-gray-50 text-gray-400 text-xs px-2 py-1 rounded-lg group-hover:bg-[#1152d4]/10 group-hover:text-[#1152d4] transition-colors">{cat.count}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Posts Mini */}
          {initialBlogs.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-[#0B1F3A] mb-4 flex items-center justify-between">
                Popular Posts
                <span className="material-symbols-outlined text-gray-300">trending_up</span>
              </h3>
              <ul className="space-y-4">
                {initialBlogs.slice(0, 3).map((article, i) => (
                  <li key={i} className="flex gap-4 group cursor-pointer border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                      <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform"/>
                    </div>
                    <div className="flex flex-col justify-center">
                      <Link href={`/blog/${article.slug}`}>
                        <h4 className="text-sm font-bold text-[#0B1F3A] leading-tight mb-1 group-hover:text-[#1152d4] transition-colors line-clamp-2">{article.title}</h4>
                      </Link>
                      <p className="text-[10px] text-gray-400 font-semibold uppercase">{article.date}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Booking CTA */}
          <a 
            href={whatsappLink(`Hi! I am interested in booking a self-drive car in ${settings.city || 'Indore'}.`, settings.whatsapp)} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-[#25D366] text-white p-4 rounded-3xl hover:bg-[#20bd5a] transition-colors shadow-lg active:scale-95 group"
          >
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform">
              <span className="material-symbols-outlined text-white">directions_car</span>
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-white/80 uppercase tracking-widest">Ready to go?</p>
              <p className="font-bold text-lg leading-tight">Book a Car in {settings.city || 'Indore'}</p>
            </div>
          </a>
        </aside>
      </div>
    </div>
  );
}
