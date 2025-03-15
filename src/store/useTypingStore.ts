import { create } from 'zustand';
import { englishTexts, chineseTexts } from '@/data/sampleTexts';

interface HistoryRecord {
  id: string;
  date: string;
  text: string;
  isEnglish: boolean;
  time: number;
  apm: number;
  maxStreak: number;
}

interface Settings {
  isSettingsOpen: boolean;
  isEnglish: boolean;
  showKeyHints: boolean;
  enableSound: boolean;
  fontSize: number;
  useBoldText: boolean;
  inputHeight: number;
}

interface TypingState {
  currentText: string;
  inputText: string;
  startTime: number | null;
  apm: number;
  elapsedTime: number;
  streak: number;
  maxStreak: number;
  isCompleted: boolean;
  isPaused: boolean;
  history: HistoryRecord[];
  settings: Settings;
  
  // Actions
  setInputText: (text: string) => void;
  toggleLanguage: () => void;
  toggleKeyHints: () => void;
  toggleSound: () => void;
  toggleBoldText: () => void;
  setFontSize: (size: number) => void;
  setInputHeight: (height: number) => void;
  resetText: () => void;
  toggleSettings: () => void;
  updateMetrics: () => void;
  resetMetrics: () => void;
  addHistoryRecord: () => void;
  clearHistory: () => void;
}

const getRandomText = (texts: string[]) => {
  return texts[Math.floor(Math.random() * texts.length)];
};

const loadHistory = (): HistoryRecord[] => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('typing-history');
  return saved ? JSON.parse(saved) : [];
};

const saveHistory = (history: HistoryRecord[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('typing-history', JSON.stringify(history));
};

const loadSettings = (): Settings => {
  const defaultSettings: Settings = {
    isSettingsOpen: false,
    isEnglish: true,
    showKeyHints: true,
    enableSound: true,
    fontSize: 16,
    useBoldText: false,
    inputHeight: 150,
  };

  if (typeof window === 'undefined') return defaultSettings;

  try {
    const saved = localStorage.getItem('typing-settings');
    if (!saved) return defaultSettings;

    const savedSettings = JSON.parse(saved);
    // 确保返回的对象包含所有必要的字段，且 isSettingsOpen 始终为 false
    return {
      ...defaultSettings,
      ...savedSettings,
      isSettingsOpen: false,
    };
  } catch {
    return defaultSettings;
  }
};

const saveSettings = (settings: Settings) => {
  if (typeof window === 'undefined') return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isSettingsOpen, ...settingsToSave } = settings;
    localStorage.setItem('typing-settings', JSON.stringify(settingsToSave));
  } catch {
    console.error('Failed to save settings');
  }
};

export const useTypingStore = create<TypingState>((set, get) => {
  const initialSettings = loadSettings();
  
  return {
    currentText: getRandomText(initialSettings.isEnglish ? englishTexts : chineseTexts),
    inputText: '',
    startTime: null,
    apm: 0,
    elapsedTime: 0,
    streak: 0,
    maxStreak: 0,
    isCompleted: false,
    isPaused: false,
    history: loadHistory(),
    settings: initialSettings,

    setInputText: (text) => {
      const state = get();
      if (state.startTime === null && text.length > 0) {
        set({ startTime: Date.now() });
      }
      
      const isCompleted = text === state.currentText;
      set({ 
        inputText: text,
        isCompleted,
        isPaused: isCompleted,
      });

      if (isCompleted) {
        get().addHistoryRecord();
      }
    },

    toggleLanguage: () => {
      const state = get();
      const newSettings = {
        ...state.settings,
        isEnglish: !state.settings.isEnglish,
      };
      const newTexts = !state.settings.isEnglish ? englishTexts : chineseTexts;
      
      set({
        settings: newSettings,
        currentText: getRandomText(newTexts),
        inputText: '',
        startTime: null,
        apm: 0,
        elapsedTime: 0,
        streak: 0,
        maxStreak: 0,
        isCompleted: false,
        isPaused: false,
      });
      
      saveSettings(newSettings);
    },

    toggleKeyHints: () => {
      const state = get();
      const newSettings = {
        ...state.settings,
        showKeyHints: !state.settings.showKeyHints,
      };
      set({ settings: newSettings });
      saveSettings(newSettings);
    },

    toggleSound: () => {
      const state = get();
      const newSettings = {
        ...state.settings,
        enableSound: !state.settings.enableSound,
      };
      set({ settings: newSettings });
      saveSettings(newSettings);
    },

    toggleBoldText: () => {
      const state = get();
      const newSettings = {
        ...state.settings,
        useBoldText: !state.settings.useBoldText,
      };
      set({ settings: newSettings });
      saveSettings(newSettings);
    },

    setFontSize: (size) => {
      const state = get();
      const newSettings = {
        ...state.settings,
        fontSize: size,
      };
      set({ settings: newSettings });
      saveSettings(newSettings);
    },

    setInputHeight: (height) => {
      const state = get();
      const newSettings = {
        ...state.settings,
        inputHeight: height,
      };
      set({ settings: newSettings });
      saveSettings(newSettings);
    },

    resetText: () => {
      const state = get();
      const texts = state.settings.isEnglish ? englishTexts : chineseTexts;
      set({
        currentText: getRandomText(texts),
        inputText: '',
        startTime: null,
        apm: 0,
        elapsedTime: 0,
        streak: 0,
        maxStreak: 0,
        isCompleted: false,
        isPaused: false,
      });
    },

    toggleSettings: () => {
      const state = get();
      const newSettings = {
        ...state.settings,
        isSettingsOpen: !state.settings.isSettingsOpen,
      };
      set({ settings: newSettings });
    },

    updateMetrics: () => {
      const state = get();
      if (state.startTime === null || state.isPaused) return;

      const now = Date.now();
      const elapsedTime = (now - state.startTime) / 1000;
      const charactersTyped = state.inputText.length;
      const apm = Math.round((charactersTyped / elapsedTime) * 60);
      const newStreak = state.inputText === state.currentText.substring(0, state.inputText.length)
        ? state.streak + 1
        : 0;

      set({
        apm,
        elapsedTime,
        streak: newStreak,
        maxStreak: Math.max(state.maxStreak, newStreak),
      });
    },

    resetMetrics: () => {
      set({
        startTime: null,
        apm: 0,
        elapsedTime: 0,
        streak: 0,
        maxStreak: 0,
        isCompleted: false,
        isPaused: false,
      });
    },

    addHistoryRecord: () => {
      const state = get();
      const newRecord: HistoryRecord = {
        id: Date.now().toString(),
        date: new Date().toLocaleString(),
        text: state.currentText,
        isEnglish: state.settings.isEnglish,
        time: state.elapsedTime,
        apm: state.apm,
        maxStreak: state.maxStreak,
      };

      const newHistory = [newRecord, ...state.history].slice(0, 100);
      set({ history: newHistory });
      saveHistory(newHistory);
    },

    clearHistory: () => {
      set({ history: [] });
      saveHistory([]);
    },
  };
}); 