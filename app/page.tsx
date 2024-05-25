"use client";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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

  const isMobile = window.innerWidth <= 768; // Define como mobile se a largura da janela for menor ou igual a 768px

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div>
        <h1>Webcam Example</h1>
        {isCameraOn ? (
          isMobile ? ( // Se for mobile, mantenha o tamanho da câmera como está
            <div>
              <Webcam
                audio={isAudioOn}
                videoConstraints={{ facingMode: facingMode }}
                ref={webcamRef}
                style={{ width: '100%', height: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                <Button onClick={toggleCamera}>Stop Camera</Button>
                <Button onClick={toggleAudio}>
                  {isAudioOn ? 'Pause Audio' : 'Resume Audio'}
                </Button>
                <Button onClick={switchCameraFacingMode}>
                  Switch Camera
                </Button>
              </div>
            </div>
          ) : ( // Se for maior que o tamanho de tela de celular, use um card para a câmera
            <Card style={{ width: '400px', height: '400px', margin: '0 auto', textAlign: 'center' }}>
              <Webcam
                audio={isAudioOn}
                videoConstraints={{ facingMode: facingMode }}
                ref={webcamRef}
                style={{ width: '100%', height: '100%' }}
              />
              <div style={{ marginTop: '10px' }}>
                <Button onClick={toggleCamera}>Stop Camera</Button>
                <Button onClick={toggleAudio}>
                  {isAudioOn ? 'Pause Audio' : 'Resume Audio'}
                </Button>
                <Button onClick={switchCameraFacingMode}>
                  Switch Camera
                </Button>
              </div>
            </Card>
          )
        ) : (
          <div>
            <Button onClick={startOnlyAudio}>Start Only Audio</Button>
            <Button onClick={toggleCamera}>Start Camera</Button>
          </div>
        )}
      </div>
    </div>
  );
}
