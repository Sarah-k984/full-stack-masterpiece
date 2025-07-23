import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import demoThumbnail from '@/assets/demo-video-thumbnail.jpg';

interface DemoVideoPlayerProps {
  onClose?: () => void;
}

const DemoVideoPlayer = ({ onClose }: DemoVideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const generateAudio = async () => {
    if (audioSrc) return; // Already generated
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-demo-speech');
      
      if (error) {
        console.error('Error generating speech:', error);
        return;
      }

      // Convert the response to a blob and create URL
      const audioBlob = new Blob([data], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(audioBlob);
      setAudioSrc(url);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayPause = async () => {
    if (!audioSrc) {
      await generateAudio();
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [audioSrc]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative">
      {/* Video Background with Visual Elements */}
      <div className="relative aspect-video rounded-lg overflow-hidden bg-gradient-hero">
        <img 
          src={demoThumbnail} 
          alt="E-Learning Demo"
          className="w-full h-full object-cover opacity-60"
        />
        
        {/* Animated Overlay Elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30">
          {/* Floating Education Icons */}
          <div className="absolute top-4 left-4 animate-pulse">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <Volume2 className="h-6 w-6 text-white" />
            </div>
          </div>
          
          {/* Central Play/Pause Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              size="lg"
              onClick={togglePlayPause}
              disabled={isLoading}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white h-16 w-16 rounded-full"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
              ) : isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 ml-1" />
              )}
            </Button>
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-16 left-6 right-6 text-white">
            <h3 className="text-2xl font-bold mb-2">Ujuzi Skills Demo</h3>
            <p className="text-sm opacity-90">Transforming Lives Through Digital Education</p>
          </div>

          {/* Progress Bar */}
          {audioSrc && (
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center space-x-3 text-white text-sm">
                <span>{formatTime(currentTime)}</span>
                <div className="flex-1 bg-white/20 rounded-full h-1 overflow-hidden">
                  <div 
                    className="bg-white h-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden Audio Element */}
      {audioSrc && (
        <audio
          ref={audioRef}
          src={audioSrc}
          preload="metadata"
        />
      )}

      {/* Video Description */}
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          {isLoading ? "Generating personalized demo audio..." : 
           audioSrc ? "Click play to hear how Ujuzi Skills can transform your future" :
           "Click the play button to start the demo"}
        </p>
      </div>
    </div>
  );
};

export default DemoVideoPlayer;