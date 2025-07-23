// src/components/AudioPlayer.jsx
import { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

function AudioPlayer({ src }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const seekTime = (e.target.value / 100) * audio.duration;
    audio.currentTime = seekTime;
    setProgress(e.target.value);
  };

  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3 flex flex-col gap-2 w-full shadow">
      <audio ref={audioRef} src={src} preload="auto" />
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={togglePlay}
          className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <div className="flex-1">
          <input
            type="range"
            value={progress}
            onChange={handleSeek}
            className="w-full accent-blue-500"
          />
        </div>
        <span className="text-xs text-gray-600 dark:text-gray-300 min-w-[40px] text-right">
          {formatTime(audioRef.current?.currentTime || 0)} / {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}

export default AudioPlayer;
