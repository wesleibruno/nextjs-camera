"use client";
// Importe useState, useRef e useEffect
import { useState, useRef, useEffect } from 'react';
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
  const webcamRef = useRef(null);
  const recognition = useRef<any>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isTranscriptionActive, setIsTranscriptionActive] = useState(false); // Novo estado para controlar a transcrição de áudio
  const [facingMode, setFacingMode] = useState('user');
  const [isMobile, setIsMobile] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isAudioOn && isTranscriptionActive && recognition.current === null) { // Adiciona verificação para transcrição de áudio ativa
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
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
      } else {
        console.error('Speech recognition not supported.');
      }
    } else if ((!isAudioOn || !isTranscriptionActive) && recognition.current !== null) {
      recognition.current.stop();
      recognition.current = null;
    }
  }, [isAudioOn, isTranscriptionActive]); // Adiciona isTranscriptionActive à lista de dependências

  const toggleCamera = () => {
    setIsCameraOn(prevState => !prevState);
  };

  const toggleAudio = () => {
    setIsAudioOn(prevState => !prevState);
  };

  const toggleTranscription = () => { // Função para alternar a transcrição de áudio
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
        {isAudioOn && ( // Renderiza o botão para ativar/desativar a transcrição de áudio apenas se o áudio estiver ativado
          <div className="flex justify-center p-4">
            <Button onClick={toggleTranscription}>
              {isTranscriptionActive ? 'Disable Transcription' : 'Enable Transcription'}
            </Button>
          </div>
        )}
        {isTranscriptionActive && ( // Renderiza o textarea apenas se a transcrição de áudio estiver ativada
          <textarea
            value={transcribedText}
            onChange={event => setTranscribedText(event.target.value)}
            className="w-full h-20 mt-4 p-2"
            placeholder="Transcribed text will appear here..."
            readOnly
          />
        )}
      </Card>
    </div>
  );
}
