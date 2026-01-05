'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import VideoPlayer, { VideoPlayerRef } from './VideoPlayer';

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
  const videoRefs = useRef<(VideoPlayerRef | null)[]>([]);

  const nextVideo = () => {
    // 停止当前视频
    if (videoRefs.current[currentIndex]) {
      videoRefs.current[currentIndex]?.stop();
    }
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  const prevVideo = () => {
    // 停止当前视频
    if (videoRefs.current[currentIndex]) {
      videoRefs.current[currentIndex]?.stop();
    }
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  // 当索引变化时，停止所有非活动视频
  useEffect(() => {
    videoRefs.current.forEach((ref, index) => {
      if (ref && index !== currentIndex) {
        ref.stop();
      }
    });
  }, [currentIndex]);

  return (
    <div className="relative mt-8 lg:mt-0 flex items-center justify-center">
      <div className="relative w-full max-w-sm h-[400px] sm:h-[450px] md:h-[550px] lg:h-[600px] bg-surface border border-border rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 group">
        <motion.div
          className="w-full h-full carousel-track flex flex-col"
          animate={{ y: `-${currentIndex * 100}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {videos.map((video, index) => (
            <VideoPlayer
              key={video.id}
              ref={(el) => {
                videoRefs.current[index] = el;
              }}
              url={video.url}
              title={video.title}
              tag={video.tag}
              tagColor={video.tagColor}
              isActive={index === currentIndex}
            />
          ))}
        </motion.div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
          <button
            onClick={prevVideo}
            className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all shadow-lg"
            aria-label="Previous video"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <button
            onClick={nextVideo}
            className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all shadow-lg"
            aria-label="Next video"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* Video indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (videoRefs.current[currentIndex]) {
                  videoRefs.current[currentIndex]?.stop();
                }
                setCurrentIndex(index);
              }}
              className={`h-1.5 rounded-full transition-all ${
                index === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
              }`}
              aria-label={`Go to video ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
