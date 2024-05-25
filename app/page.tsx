"use client";
import { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Home() {
  const webcamRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [facingMode, setFacingMode] = useState('user');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleCamera = () => {
    setIsCameraOn((prevState) => !prevState);
  };

  const toggleAudio = () => {
    setIsAudioOn((prevState) => !prevState);
  };

  const startOnlyAudio = () => {
    setIsCameraOn(true);
    setIsAudioOn(true);
  };

  const switchCameraFacingMode = () => {
    setFacingMode((prevFacingMode) =>
      prevFacingMode === 'user' ? 'environment' : 'user'
    );
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-400 h-400 text-center">
        <h1>Webcam Example</h1>
        {isCameraOn ? (
          <div>
            <Webcam
              audio={isAudioOn}
              videoConstraints={{ facingMode: facingMode }}
              ref={webcamRef}
              className="w-full h-full"
            />
            <div className="flex justify-center p-4 space-x-4">
              <Button onClick={toggleCamera}>Stop Camera</Button>
              <Button onClick={toggleAudio}>
                {isAudioOn ? 'Pause Audio' : 'Resume Audio'}
              </Button>
              <Button onClick={switchCameraFacingMode}>
                Switch Camera
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <Button onClick={startOnlyAudio}>Start Only Audio</Button>
            <Button onClick={toggleCamera}>Start Camera</Button>
          </div>
        )}
      </Card>
    </div>
  );
}