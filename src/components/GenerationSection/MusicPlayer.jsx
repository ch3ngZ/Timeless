import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import CircularProgress from '@mui/material/CircularProgress';  // Import MUI CircularProgress

const MusicPlayer = ({ musicData, isLoading }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef('/assets/Color.mp3');

  useEffect(() => {
    if (musicData && audioRef.current) {
      audioRef.current.src = musicData.audio_url; // Set audio source when musicData changes
    }
  }, [musicData]);

  const formatTime = (time) => {
    const min = String(Math.floor(time / 60)).padStart(2, '0');
    const sec = String(Math.floor(time % 60)).padStart(2, '0');
    return `${min}:${sec}`;
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const currentTime = audioRef.current.currentTime || 0;
    const duration = audioRef.current.duration || 0;
    document.querySelector('.current-time').textContent = formatTime(currentTime);
    document.querySelector('.music_progress_line').style.width = `${(currentTime / duration) * 100}%`;
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="bg-gradient-to-br from-blue-100 border-4 border-white hover:bg-white via-purple-200 to-purple-200 rounded-lg p-6 shadow-md max-w-sm mx-auto">
      <div className="aspect-square bg-purple-300 rounded-lg mb-4 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <CircularProgress />
          </div>
        ) : musicData ? (
          <img src={musicData.image_url} alt="Album cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-purple-400"></div> // Placeholder
        )}
      </div>
      <h2 className="text-xl font-semibold mb-2 ml-2 text-purple-600 flex justify-center">{musicData?.title || 'Ready for a cool song?'}</h2>
      <div className="mb-4 bg-purple-100 rounded-full h-1 overflow-hidden">
        <div className="progress-bar-fill bg-purple-500 h-full w-0 transition-all duration-300 ease-in-out"></div>
      </div>
      <button 
        className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition duration-300 ease-in-out mx-auto"
        onClick={handlePlayPause}
      >
        {isPlaying ? (
          <Pause className="text-purple-600 " size={24} />
        ) : (
          <Play className="text-purple-600" size={24} />
        )}
      </button>
      <audio 
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
    </div>
  );
};

export default MusicPlayer;