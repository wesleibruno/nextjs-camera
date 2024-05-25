"use client";
import { useState, useRef } from 'react';
import Webcam from 'react-webcam';

export default function Home() {
  const webcamRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);

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

  return (
    <div>
      <h1>Webcam Example</h1>
      {isCameraOn ? (
        <div>
          <Webcam audio={isAudioOn} ref={webcamRef} />
          <button onClick={toggleCamera}>Stop Camera</button>
          <button onClick={toggleAudio}>{isAudioOn ? 'Pause Audio' : 'Resume Audio'}</button>
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
