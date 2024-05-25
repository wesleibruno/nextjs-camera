"use client";
import { Button } from '@/components/ui/button';
import { useState, useRef } from 'react';
import Webcam from 'react-webcam';

export default function Home() {
  const webcamRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [facingMode, setFacingMode] = useState('user'); // 'user' para câmera frontal, 'environment' para câmera traseira

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
    <div>
      <h1>Webcam Example</h1>
      {isCameraOn ? (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Webcam
            audio={isAudioOn}
            videoConstraints={{ facingMode: facingMode }}
            ref={webcamRef}
            style={{ width: '100%', height: '100%' }}
          />
          <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
            <Button onClick={toggleCamera}>
              Stop Camera
            </Button>
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
    </div>
  );
}