'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import VideoPlayer from './VideoPlayer';

const videos = [
  {
    id: 1,
    url: 'https://www.youtube.com/embed/8TQaJDCw-dE?controls=1&modestbranding=1&rel=0&playsinline=1',
    title: 'What is Vibe Coding?',
    tag: 'Intro',
    tagColor: 'bg-blue-600',
  },
  {
    id: 2,
    url: 'https://www.youtube.com/embed/Tw18-4U7mts?controls=1&modestbranding=1&rel=0&playsinline=1',
    title: 'The "Mind Virus" Explained',
    tag: 'Deep Dive',
    tagColor: 'bg-purple-600',
  },
  {
    id: 3,
    url: 'https://www.youtube.com/embed/iLCDSY2XX7E?controls=1&modestbranding=1&rel=0&playsinline=1',
    title: '33 Min Crash Course',
    tag: 'Tutorial',
    tagColor: 'bg-green-600',
  },
];

export default function VideoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextVideo = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  const prevVideo = () => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  return (
    <div className="relative mt-8 lg:mt-0 flex items-center justify-center">
      <div className="relative w-full max-w-sm h-[450px] md:h-[550px] lg:h-[600px] bg-surface border border-border rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 group">
        <motion.div
          className="w-full h-full carousel-track flex flex-col"
          animate={{ y: `-${currentIndex * 100}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {videos.map((video) => (
            <VideoPlayer
              key={video.id}
              url={video.url}
              title={video.title}
              tag={video.tag}
              tagColor={video.tagColor}
            />
          ))}
        </motion.div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
          <button
            onClick={prevVideo}
            className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all shadow-lg"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <button
            onClick={nextVideo}
            className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all shadow-lg"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
