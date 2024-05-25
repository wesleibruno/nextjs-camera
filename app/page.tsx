"use client";
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
        <div>
          <Webcam
            audio={isAudioOn}
            videoConstraints={{ facingMode: facingMode }}
            ref={webcamRef}
          />
          <button onClick={toggleCamera}>Stop Camera</button>
          <button onClick={toggleAudio}>
            {isAudioOn ? 'Pause Audio' : 'Resume Audio'}
          </button>
          <button onClick={switchCameraFacingMode}>Switch Camera</button>
        </div>
      ) : (
        <div>
          <button onClick={startOnlyAudio}>Start Only Audio</button>
          <button onClick={toggleCamera}>Start Camera</button>
        </div>
      )}
    </div>
  );
}
