'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { InstagramReel } from '@/types';

import { useSettings } from '@/components/SettingsProvider';

export function InstagramReels() {
  const { settings } = useSettings();
  const [reels, setReels] = useState<InstagramReel[]>([]);
  const [activeReelUrl, setActiveReelUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchReels = async () => {
      const { data } = await supabase
        .from('instagram_reels')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: true })
        .limit(8);

      if (data) setReels(data as InstagramReel[]);
    };
    fetchReels();
  }, []);

  if (reels.length === 0) return null;

  // Extract ID from full URL (e.g., https://www.instagram.com/reel/C7XNxtsPCtI/)
  const getReelId = (url: string) => {
    const match = url.match(/(?:reel|p)\/([A-Za-z0-9_-]+)/);
    return match ? match[1] : null;
  };

  return (
    <>
      <section className="py-24 px-6 lg:px-8 bg-white relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#E89B10]/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#0B1F3A] font-headline tracking-tight mb-4">
              Follow Our Journey
            </h2>
            <p className="text-gray-500 text-lg">
              Watch real experiences from our customers and stay updated with the latest from {settings.name}.
            </p>
          </div>

          {/* Responsive Layout: Mobile Slider / Desktop Grid */}
          <style dangerouslySetInnerHTML={{__html: `
            .hide-scrollbar::-webkit-scrollbar { display: none; }
            .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `}} />
          <div className="flex md:grid md:grid-cols-3 overflow-x-auto md:overflow-x-visible scroll-smooth snap-x snap-mandatory gap-4 md:gap-6 pb-6 md:pb-0 -mx-6 md:mx-0 px-6 md:px-0 w-[calc(100%+3rem)] md:w-full hide-scrollbar">
            {reels.map((reel) => {
              const reelId = getReelId(reel.reel_url);
              if (!reelId) return null;

              return (
                <div
                  key={reel.id}
                  className="group relative aspect-[9/16] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gray-100 min-w-[85%] md:min-w-0 flex-shrink-0 snap-center md:snap-align-none"
                >
                  {/* Thumbnail OR Native Embed */}
                  {reel.thumbnail ? (
                    <div className="absolute inset-0 w-full h-full cursor-pointer" onClick={() => setActiveReelUrl(`https://www.instagram.com/p/${reelId}/embed`)}>
                      <img
                        src={reel.thumbnail}
                        alt="Instagram Reel Thumbnail"
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                  ) : (
                    <iframe
                      src={`https://www.instagram.com/p/${reelId}/embed`}
                      className="absolute inset-0 w-full h-[calc(100%+80px)] -mt-10"
                      style={{ border: 'none', overflow: 'hidden' }}
                      scrolling="no"
                      allowTransparency
                      allowFullScreen
                    />
                  )}

                  {/* Gradient Overlay and Icons (Only for internal thumbnail variant) */}
                  {reel.thumbnail && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 opacity-60 group-hover:opacity-80 pointer-events-none" />
                      
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.3)] border border-white/30">
                          <span className="material-symbols-outlined text-4xl ml-1">play_arrow</span>
                        </div>
                      </div>
                    </>
                  )}

            {/* Top Right Insta Icon */}
<div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-full flex items-center justify-center text-white shadow-lg">
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
      clipRule="evenodd"
    />
  </svg>
</div>

</div>
);
})}
</div>

          <div className="mt-12 text-center">
            <a
              href={settings.instagramUrl || 'https://instagram.com/'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#0B1F3A] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#0B1F3A]/90 hover:-translate-y-1 transition-all shadow-lg shadow-[#0B1F3A]/20"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
              Follow on Instagram
            </a>
          </div>
        </div>
      </section>

      {/* Modal Video Player */}
      {activeReelUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
          {/* Close Overlay */}
          <div className="absolute inset-0" onClick={() => setActiveReelUrl(null)} />
          
          <div className="relative w-full max-w-[400px] bg-black rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col">
            <button
              onClick={() => setActiveReelUrl(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-md"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            
            <div className="relative aspect-[9/16] w-full bg-[#111]">
              <iframe
                src={activeReelUrl}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                scrolling="no"
                allowTransparency
                allowFullScreen
                title="Instagram Reel"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
