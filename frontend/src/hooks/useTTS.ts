import { useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';

const LANG_CODES: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
};

// Fallback lang codes if primary not available
const LANG_FALLBACKS: Record<string, string[]> = {
  'mr-IN': ['mr-IN', 'mr', 'hi-IN', 'en-IN'],
  'hi-IN': ['hi-IN', 'hi', 'en-IN'],
  'en-IN': ['en-IN', 'en-US', 'en-GB', 'en'],
};

function getBestVoice(targetLang: string): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  const fallbacks = LANG_FALLBACKS[targetLang] || [targetLang, 'en-IN'];

  for (const lang of fallbacks) {
    // Exact match first
    const exact = voices.find(v => v.lang === lang);
    if (exact) return exact;
    // Prefix match (e.g. "mr" matches "mr-IN")
    const prefix = voices.find(v => v.lang.startsWith(lang.split('-')[0]));
    if (prefix) return prefix;
  }
  return null;
}

export function useTTS() {
  const { language } = useLanguage();

  const speak = useCallback((text: string, overrideLang?: string) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const targetLang = LANG_CODES[overrideLang || language] || 'en-IN';

    const doSpeak = () => {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = targetLang;
      utter.rate = 0.9;
      utter.pitch = 1;

      const voice = getBestVoice(targetLang);
      if (voice) {
        utter.voice = voice;
        utter.lang = voice.lang; // use exact lang of chosen voice
      }

      window.speechSynthesis.speak(utter);
    };

    // Voices may not be loaded yet on first call
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        doSpeak();
      };
    } else {
      doSpeak();
    }
  }, [language]);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
  }, []);

  return { speak, stop };
}
