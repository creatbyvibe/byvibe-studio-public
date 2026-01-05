'use client';

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

interface VideoPlayerProps {
  url: string;
  title: string;
  tag: string;
  tagColor: string;
  isActive?: boolean;
}

export interface VideoPlayerRef {
  stop: () => void;
}

const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  ({ url, title, tag, tagColor, isActive = false }, ref) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [iframeSrc, setIframeSrc] = useState<string>('');

    // 停止视频播放
    const stop = () => {
      if (iframeRef.current) {
        // 通过清空 src 来停止视频播放
        const currentSrc = iframeRef.current.src;
        iframeRef.current.src = '';
        // 保存原始 URL 以便后续恢复
        setTimeout(() => {
          if (iframeRef.current && currentSrc) {
            // 移除 autoplay 和 mute 参数，确保不会自动播放
            const cleanUrl = currentSrc
              .replace(/[?&]autoplay=1/g, '')
              .replace(/[?&]mute=1/g, '')
              .replace(/[?&]enablejsapi=1/g, '');
            setIframeSrc(cleanUrl);
          }
        }, 50);
      }
    };

    useImperativeHandle(ref, () => ({
      stop,
    }));

    useEffect(() => {
      setIsLoaded(true);
      // 初始设置 URL，不自动播放，添加 enablejsapi 以便控制
      const cleanUrl = url
        .replace(/[?&]autoplay=1/g, '')
        .replace(/[?&]mute=1/g, '')
        .replace(/[?&]enablejsapi=1/g, '');
      // 如果 URL 中没有参数，添加 ?，否则添加 &
      const separator = cleanUrl.includes('?') ? '&' : '?';
      setIframeSrc(`${cleanUrl}${separator}enablejsapi=1`);
    }, [url]);

    // 当视频变为非活动状态时停止播放
    useEffect(() => {
      if (!isActive && iframeRef.current) {
        const currentSrc = iframeRef.current.src;
        if (currentSrc) {
          iframeRef.current.src = '';
        }
      }
    }, [isActive]);

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
          ref={iframeRef}
          className="w-full h-full absolute inset-0 pointer-events-auto"
          src={isActive ? iframeSrc : ''}
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
