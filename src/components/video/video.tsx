'use client';

import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';
import './video.css';

import { useEffect, useRef, useState } from 'react';
import { mergeStyle } from '@/libs/helper';
import { Image, IImage } from '@/components/image';
import { IconMute, IconPause, IconPlay, IconSound } from './icons';

export interface IVideo {
  src: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  disablePause?: boolean;
  enableFullscreen?: boolean;
  poster?: IImage['src'];
  posterAlt?: IImage['alt'];
  posterSizes?: IImage['sizes'];
  className?: string;
}

export const Video = ({
  src,
  autoplay = false,
  muted = false,
  loop = true,
  disablePause = false,
  enableFullscreen = false,
  poster,
  posterAlt,
  posterSizes,
  className,
}: IVideo) => {
  const videoRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<Player | null>(null);

  // Set autoplay true if video pause button disabled
  disablePause && (autoplay = true);

  // Set muted if autoplay true
  autoplay && (muted = true);

  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isPlay, setIsPlay] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);

  // Set video sources
  const videoSources: { src?: string | null; type?: string | null }[] = [];

  if (typeof src === `string`) {
    videoSources.push({ src });
  }

  useEffect(() => {
    if (!videoRef.current) return;

    // Make sure Video.js player is only initialized once
    if (playerRef.current) return;

    // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
    const videoElement = document.createElement(`video-js`);
    videoElement.classList.add(`vjs-big-play-centered`);
    videoRef.current.appendChild(videoElement);

    // Assign videojs into ref
    playerRef.current = videojs(videoElement, {
      sources: videoSources,
      loop,
      autoplay,
      muted,
      controlBar: {
        fullscreenToggle: enableFullscreen,
      },
      userActions: {
        doubleClick: false,
      },
      controls: false,
      responsive: false,
      fluid: true,
      playsinline: true,
    });

    setIsPlayerReady(true);

    if (autoplay) {
      setIsPlay(true);
    }
  }, []);

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  const handlePlayButton = () => {
    if (!playerRef.current) return;
    if (disablePause) return;

    if (playerRef.current.paused()) {
      playerRef.current.play();
      setIsPlay(true);
    } else {
      playerRef.current.pause();
      setIsPlay(false);
    }
  };

  const handleSoundButton = () => {
    if (!playerRef.current) return;

    playerRef.current.muted(!isMuted);
    setIsMuted(!isMuted);
  };

  return (
    <div
      className={mergeStyle(
        `video-player relative w-full h-full text-white group/video-player`,
        className,
      )}
    >
      {/* Video Player */}
      <div
        className="video-player__inner-player w-full h-full"
        ref={videoRef}
      />

      {/* Poster Image */}
      {poster && (
        <div
          className={mergeStyle(
            `video-player__poster absolute inset-0 z-0 transition-all visible opacity-100`,
            isPlay && `invisible opacity-0`,
          )}
        >
          <Image
            src={poster}
            alt={posterAlt}
            sizes={posterSizes}
            className="object-cover"
            fill
          />
        </div>
      )}

      {/* Play Pause Button */}
      <button
        type="button"
        className={mergeStyle(
          `video-player__play-button absolute z-10 inset-0 flex justify-center items-center transition opacity-0 group-hover/video-player:opacity-100`,
          disablePause && `hidden`,
          !isPlayerReady && `hidden`,
        )}
        onClick={() => handlePlayButton()}
      >
        <div className="relative z-10 w-1/2 max-w-8 drop-shadow cursor-pointer">
          {isPlay ? <IconPause /> : <IconPlay />}
        </div>
      </button>

      {/* Sound / Mute Button */}
      <button
        type="button"
        className={mergeStyle(
          `video-player__sound-button absolute z-20 w-[5%] max-w-6 bottom-4 right-4 drop-shadow cursor-pointer`,
          !isPlayerReady && `hidden`,
        )}
        onClick={() => handleSoundButton()}
      >
        {isMuted ? <IconMute /> : <IconSound />}
      </button>
    </div>
  );
};
