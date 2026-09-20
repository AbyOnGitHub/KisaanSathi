import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

type VoiceState = 'idle' | 'listening' | 'processing' | 'success' | 'error';

interface VoiceInputButtonProps {
  onTranscript?: (transcript: string) => void;
  prompt?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  prompt,
  className = '',
  size = 'md',
}) => {
  const { language, t } = useLanguage();
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearSafetyTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const langMap: Record<string, string> = {
    en: 'en-IN',
    hi: 'hi-IN',
    mr: 'mr-IN',
  };

  const stopListening = () => {
    clearSafetyTimeout();
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopListening();
  }, []);

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceState('error');
      setErrorMsg(t('voice_denied'));
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = langMap[language] || 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    let settled = false; // guards against onend firing after we've already handled result/error

    recognition.onstart = () => {
      setVoiceState('listening');
      // Safety net: some browsers/devices silently never fire onresult,
      // onerror, or onend (e.g. mic granted but no audio reaching the
      // recognizer). Without this the button was getting stuck showing
      // "Listening..." forever with no feedback.
      clearSafetyTimeout();
      timeoutRef.current = setTimeout(() => {
        if (settled) return;
        settled = true;
        recognitionRef.current = null;
        try { recognition.stop(); } catch { /* already stopped */ }
        setErrorMsg(t('voice_error'));
        setVoiceState('error');
        setTimeout(() => setVoiceState('idle'), 3000);
      }, 8000);
    };

    recognition.onresult = (event: any) => {
      settled = true;
      clearSafetyTimeout();
      setVoiceState('processing');
      const transcript = event.results[0][0].transcript;
      setTimeout(() => {
        setVoiceState('success');
        onTranscript?.(transcript);
        setTimeout(() => setVoiceState('idle'), 2000);
      }, 300);
    };

    recognition.onerror = (event: any) => {
      settled = true;
      clearSafetyTimeout();
      if (event.error === 'not-allowed') {
        setErrorMsg(t('voice_denied'));
      } else {
        setErrorMsg(t('voice_error'));
      }
      setVoiceState('error');
      setTimeout(() => setVoiceState('idle'), 3000);
    };

    recognition.onend = () => {
      clearSafetyTimeout();
      if (!settled) {
        settled = true;
        setVoiceState('idle');
      }
    };

    try {
      recognition.start();
    } catch {
      setVoiceState('error');
      setErrorMsg(t('voice_error'));
    }
  };

  const handleClick = () => {
    if (voiceState === 'listening') {
      stopListening();
      setVoiceState('idle');
    } else if (voiceState === 'idle' || voiceState === 'error') {
      setErrorMsg('');
      startListening();
    }
  };

  const sizeClasses = {
    sm: 'p-2 text-sm',
    md: 'p-3 text-base',
    lg: 'p-4 text-lg',
  };

  const iconSize = { sm: 16, md: 20, lg: 24 }[size];

  const stateColors: Record<VoiceState, string> = {
    idle: 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100',
    listening: 'bg-red-500 text-white border-red-500 animate-pulse',
    processing: 'bg-yellow-500 text-white border-yellow-500',
    success: 'bg-green-500 text-white border-green-500',
    error: 'bg-red-100 text-red-700 border-red-300',
  };

  const stateLabel: Record<VoiceState, string> = {
    idle: prompt || t('voice_idle'),
    listening: t('voice_listening'),
    processing: t('voice_processing'),
    success: '✓ Got it!',
    error: errorMsg || t('voice_error'),
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <button
        onClick={handleClick}
        disabled={voiceState === 'processing'}
        className={`flex items-center gap-2 rounded-xl border-2 font-medium transition-all ${sizeClasses[size]} ${stateColors[voiceState]}`}
        aria-label={stateLabel[voiceState]}
      >
        {voiceState === 'processing' ? (
          <Loader size={iconSize} className="animate-spin" />
        ) : voiceState === 'error' ? (
          <MicOff size={iconSize} />
        ) : (
          <Mic size={iconSize} />
        )}
        <span>{stateLabel[voiceState]}</span>
      </button>
    </div>
  );
};
