/**
 * Custom hook for Web Speech Recognition API (Voice Search).
 * Automatically supports English (en-IN) and Hindi (hi-IN) based on the current i18n language.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

/**
 * Strips trailing and unwanted punctuation produced by speech recognition engines.
 * Removes English full stops (.), Hindi Purna Viram / danda (। \u0964), double danda (॥ \u0965),
 * pipes (|), question marks, exclamation marks, commas, quotes, etc.
 */
export const sanitizeSpeechTranscript = (text) => {
  if (!text) return '';
  return text
    // Replace Hindi danda, double danda, pipe, and full stops with spaces
    .replace(/[\u0964\u0965|.]+/g, ' ')
    // Replace other punctuation symbols
    .replace(/[?!,;:"'`~*#_—–/\\()\[\]{}]/g, ' ')
    // Collapse multiple whitespace
    .replace(/\s+/g, ' ')
    .trim();
};

export const useVoiceSearch = ({ onResult } = {}) => {
  const { t, i18n } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef(null);
  const onResultRef = useRef(onResult);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  // Check browser support on mount
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);
    } else {
      setIsSupported(false);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error(t('nav.voice_not_supported'));
      return;
    }

    // Abort existing instance if any
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // ignore
      }
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      // Select speech recognition language matching i18n
      const currentLang = i18n.language || 'en';
      recognition.lang = currentLang === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      setError(null);
      setTranscript('');

      recognition.onstart = () => {
        setIsListening(true);
        toast(t('nav.voice_listening'), {
          id: 'voice-search-toast',
          icon: '🎙️',
          duration: 3000,
        });
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        const cleanInterim = sanitizeSpeechTranscript(interimTranscript);
        const cleanFinal = sanitizeSpeechTranscript(finalTranscript);
        const currentCleanText = cleanFinal || cleanInterim;

        if (currentCleanText) {
          setTranscript(currentCleanText);
        }

        if (cleanFinal) {
          toast.dismiss('voice-search-toast');
          if (onResultRef.current) {
            onResultRef.current(cleanFinal);
          }
        }
      };

      recognition.onerror = (event) => {
        toast.dismiss('voice-search-toast');
        setIsListening(false);
        setError(event.error);

        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          toast.error(t('nav.voice_permission_denied'));
        } else if (event.error === 'no-speech') {
          toast.error(t('nav.voice_no_speech'));
        } else if (event.error !== 'aborted') {
          toast.error(t('nav.voice_error'));
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        toast.dismiss('voice-search-toast');
      };

      recognition.start();
    } catch (err) {
      console.error('Error starting speech recognition:', err);
      setIsListening(false);
      toast.dismiss('voice-search-toast');
      toast.error(t('nav.voice_error'));
    }
  }, [t, i18n.language]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    toggleListening,
  };
};

export default useVoiceSearch;
