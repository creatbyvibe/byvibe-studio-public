'use client';

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Image from 'next/image';

interface VideoPlayerProps {
  url: string;
  title: string;
  tag: string;
  tagColor: string;
  isActive?: boolean;
  shouldPlay?: boolean;
  thumbnailUrl: string;
  onPlay: () => void;
}

export interface VideoPlayerRef {
  stop: () => void;
}

const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  ({ url, title, tag, tagColor, isActive = false, shouldPlay = false, thumbnailUrl, onPlay }, ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [iframeSrc, setIframeSrc] = useState<string>('');

    const stop = () => {
      if (iframeRef.current) {
        iframeRef.current.src = '';
      }
    };

    useImperativeHandle(ref, () => ({
      stop,
    }));

    useEffect(() => {
      // 初始构建干净 URL
      const cleanUrl = url
        .replace(/[?&]autoplay=1/g, '')
        .replace(/[?&]mute=1/g, '')
        .replace(/[?&]enablejsapi=1/g, '');
      const separator = cleanUrl.includes('?') ? '&' : '?';
      setIframeSrc(`${cleanUrl}${separator}enablejsapi=1`);
    }, [url]);

    // 非活动时停止
    useEffect(() => {
      if (!isActive) {
        stop();
      }
    }, [isActive]);

    if (!shouldPlay) {
      return (
        <div className="w-full h-full shrink-0 relative bg-black group/video">
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 100vw"
            className="object-cover"
            priority={false}
          />
          <button
            onClick={onPlay}
            className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-colors"
          >
            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
              <div className="ml-1 border-l-[14px] border-l-black border-y-[10px] border-y-transparent" />
            </div>
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none">
            <span
              className={`text-[10px] ${tagColor} text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider mb-2 inline-block`}
            >
              {tag}
            </span>
            <h3 className="text-white font-bold text-base md:text-lg leading-tight">{title}</h3>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-full shrink-0 relative bg-black group/video">
        <iframe
          ref={iframeRef}
          className="w-full h-full absolute inset-0 pointer-events-auto"
          src={isActive ? `${iframeSrc}&autoplay=1&mute=1` : ''}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none">
          <span
            className={`text-[10px] ${tagColor} text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider mb-2 inline-block`}
          >
            {tag}
          </span>
          <h3 className="text-white font-bold text-base md:text-lg leading-tight">{title}</h3>
        </div>
      </div>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
