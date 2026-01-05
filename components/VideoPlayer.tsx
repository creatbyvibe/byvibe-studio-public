'use client';

import { useState, useEffect } from 'react';

interface VideoPlayerProps {
  url: string;
  title: string;
  tag: string;
  tagColor: string;
}

export default function VideoPlayer({ url, title, tag, tagColor }: VideoPlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <div className="w-full h-full relative bg-black flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading video...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full shrink-0 relative bg-black group/video">
      <iframe
        className="w-full h-full absolute inset-0 pointer-events-auto"
        src={url}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none">
        <span
          className={`text-[10px] ${tagColor} text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider mb-2 inline-block`}
        >
          {tag}
        </span>
        <h3 className="text-white font-bold text-lg leading-tight">{title}</h3>
      </div>
    </div>
  );
}
