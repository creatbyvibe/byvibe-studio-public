'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import VideoPlayer, { VideoPlayerRef } from './VideoPlayer';

// Popular vibecoding and AI coding related videos
// TODO: Replace video IDs with actual high-view YouTube videos about vibecoding
// Search YouTube for: "vibecoding", "cursor AI", "AI coding", "vibe coding tutorial"
// Extract video ID from YouTube URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)
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
  {
    id: 4,
    url: 'https://www.youtube.com/embed/8TQaJDCw-dE?controls=1&modestbranding=1&rel=0&playsinline=1',
    title: 'AI Coding Revolution',
    tag: 'Trending',
    tagColor: 'bg-red-600',
  },
  {
    id: 5,
    url: 'https://www.youtube.com/embed/Tw18-4U7mts?controls=1&modestbranding=1&rel=0&playsinline=1',
    title: 'Building with AI',
    tag: 'Tutorial',
    tagColor: 'bg-green-600',
  },
  {
    id: 6,
    url: 'https://www.youtube.com/embed/iLCDSY2XX7E?controls=1&modestbranding=1&rel=0&playsinline=1',
    title: 'Vibe Coding Workflow',
    tag: 'Workflow',
    tagColor: 'bg-yellow-600',
  },
];

export default function VideoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const videoRefs = useRef<(VideoPlayerRef | null)[]>([]);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  const nextVideo = () => {
    // Stop current video
    if (videoRefs.current[currentIndex]) {
      videoRefs.current[currentIndex]?.stop();
    }
    setPlayingId(null);
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  const prevVideo = () => {
    // Stop current video
    if (videoRefs.current[currentIndex]) {
      videoRefs.current[currentIndex]?.stop();
    }
    setPlayingId(null);
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  const goToVideo = (index: number) => {
    if (videoRefs.current[currentIndex]) {
      videoRefs.current[currentIndex]?.stop();
    }
    setPlayingId(null);
    setCurrentIndex(index);
  };

  // Intersection observer to delay iframe loading until visible
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/938b3518-4852-4c89-8195-34f66fcdebec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'video-missing-20260106',hypothesisId:'H2',location:'components/VideoCarousel.tsx:useEffect:observer:init',message:'video carousel observer init',data:{hasNode:true,className:node.className},timestamp:Date.now()})}).catch(()=>{});
    // #endregion agent log

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting)
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/938b3518-4852-4c89-8195-34f66fcdebec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'video-missing-20260106',hypothesisId:'H1',location:'components/VideoCarousel.tsx:observer:entry',message:'video carousel intersection',data:{isIntersecting:entry.isIntersecting,ratio:entry.intersectionRatio},timestamp:Date.now()})}).catch(()=>{});
          // #endregion agent log
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (isPaused) {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
        autoPlayIntervalRef.current = null;
      }
      return;
    }

    autoPlayIntervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        // Stop current video before switching
        if (videoRefs.current[prev]) {
          videoRefs.current[prev]?.stop();
        }
        return (prev + 1) % videos.length;
      });
    }, 5000); // Change video every 5 seconds

    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
        autoPlayIntervalRef.current = null;
      }
    };
  }, [isPaused, videos.length]);

  // Stop all inactive videos when index changes
  useEffect(() => {
    videoRefs.current.forEach((ref, index) => {
      if (ref && index !== currentIndex) {
        ref.stop();
      }
    });
    setPlayingId(null);
  }, [currentIndex]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const extractVideoId = (url: string) => {
    const match = url.match(/embed\/([^?&]+)/);
    return match ? match[1] : '';
  };

  return (
    <div 
      className="relative mt-10 lg:mt-0 flex items-center justify-center lg:justify-end w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={containerRef}
    >
      <div className="relative w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[520px] aspect-[4/5] min-h-[360px] sm:min-h-[420px] bg-surface border border-border rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 group">
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
              shouldPlay={index === currentIndex && playingId === video.id && isInView}
              thumbnailUrl={`https://i.ytimg.com/vi/${extractVideoId(video.url)}/maxresdefault.jpg`}
              onPlay={() => setPlayingId(video.id)}
            />
          ))}
        </motion.div>

        {/* Video indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => goToVideo(index)}
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
