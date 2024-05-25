"use client";
// Importe useState, useRef e useEffect
import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function Home() {
  const webcamRef = useRef<any>(null); // Usamos 'any' para ignorar o tipo de erro temporariamente
  const recognition = useRef<any>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isTranscriptionActive, setIsTranscriptionActive] = useState(false);
  const [facingMode, setFacingMode] = useState('user');
  const [isMobile, setIsMobile] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [isSpeechRecognitionSupported, setIsSpeechRecognitionSupported] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSpeechRecognitionSupported(!!SpeechRecognition); 

    if (isAudioOn && isTranscriptionActive && recognition.current === null && SpeechRecognition) {
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.lang = 'pt-BR';
      recognition.current.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setTranscribedText(prevText => prevText + transcript);
      };
      recognition.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };
      recognition.current.onend = () => {
        console.log('Speech recognition ended.');
      };
      recognition.current.start();
    } else if ((!isAudioOn || !isTranscriptionActive) && recognition.current !== null) {
      recognition.current.stop();
      recognition.current = null;
    }
  }, [isAudioOn, isTranscriptionActive]);

  const toggleCamera = () => {
    setIsCameraOn(prevState => !prevState);
  };

  const toggleAudio = () => {
    setIsAudioOn(prevState => !prevState);
  };

  const toggleTranscription = () => {
    setIsTranscriptionActive(prevState => !prevState);
  };

  const startOnlyAudio = () => {
    setIsCameraOn(true);
    setIsAudioOn(true);
  };

  const switchCameraFacingMode = () => {
    setFacingMode(prevFacingMode =>
      prevFacingMode === 'user' ? 'environment' : 'user'
    );
  };

  const requestMicrophonePermission = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true }) // Solicita permissão para acessar o microfone
      .then(() => {
        setIsAudioOn(true);
      })
      .catch(error => {
        console.error('Error accessing microphone:', error);
      });
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
              <Button onClick={switchCameraFacingMode}>Switch Camera</Button>
            </div>
          </div>
        ) : (
          <div>
            <Button onClick={startOnlyAudio}>Start Only Audio</Button>
            <Button onClick={toggleCamera}>Start Camera</Button>
          </div>
        )}
        {isAudioOn && isSpeechRecognitionSupported && (
          <div className="flex justify-center p-4">
            <Button onClick={toggleTranscription}>
              {isTranscriptionActive ? 'Disable Transcription' : 'Enable Transcription'}
            </Button>
          </div>
        )}
        {isTranscriptionActive && (
          <textarea
            value={transcribedText}
            onChange={event => setTranscribedText(event.target.value)}
            className="w-full h-20 mt-4 p-2"
            placeholder="Transcribed text will appear here..."
            readOnly
          />
        )}
        {!isAudioOn && !isMobile && ( // Mostra o botão de solicitação de permissão apenas se o áudio estiver desativado e não for um dispositivo móvel
          <div className="flex justify-center p-4">
            <Button onClick={requestMicrophonePermission}>Allow Microphone Access</Button>
          </div>
        )}
     
     {!isAudioOn && !isMobile && (
          // Mostra o botão de solicitação de permissão apenas se o áudio estiver desativado e não for um dispositivo móvel
          <div className="flex justify-center p-4">
            <Button onClick={requestMicrophonePermission}>Allow Microphone Access</Button>
          </div>
        )}
      </Card>
    </div>
  );
}
