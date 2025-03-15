'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { VirtualKeyboard } from '@/components/VirtualKeyboard';
import { SettingsPanel } from '@/components/SettingsPanel';
import { SpeedMilestone } from '@/components/SpeedMilestone';
import { CompletionModal } from '@/components/CompletionModal';
import { HistoryModal } from '@/components/HistoryModal';
import { useTypingStore } from '@/store/useTypingStore';
import { Cog6ToothIcon, ClockIcon } from '@heroicons/react/24/outline';
import { speakWord } from '@/utils/speech';

const getApmColor = (apm: number) => {
  if (apm >= 100) return 'text-purple-600 font-bold';
  if (apm >= 80) return 'text-blue-600 font-bold';
  if (apm >= 60) return 'text-green-600 font-bold';
  return 'text-gray-700 font-medium';
};

const getStreakColor = (streak: number) => {
  if (streak >= 50) return 'text-purple-600 font-bold';
  if (streak >= 35) return 'text-blue-600 font-bold';
  if (streak >= 20) return 'text-green-600 font-bold';
  return 'text-gray-700 font-medium';
};

export default function Home() {
  const {
    currentText,
    inputText,
    settings: {
      fontSize,
      useBoldText,
      inputHeight,
      isEnglish,
      enableSound,
    },
    apm,
    elapsedTime,
    streak,
    maxStreak,
    isCompleted,
    setInputText,
    updateMetrics,
    toggleSettings,
    resetText,
  } = useTypingStore();

  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const lastWordEndIndex = useRef<number>(0);

  useEffect(() => {
    const interval = setInterval(updateMetrics, 1000);
    return () => clearInterval(interval);
  }, [updateMetrics]);

  useEffect(() => {
    if (isCompleted) {
      setShowCompletionModal(true);
    }
  }, [isCompleted]);

  useEffect(() => {
    if (!enableSound) return;

    if (isEnglish) {
      // English mode: speak when a complete word is typed correctly
      const currentPosition = inputText.length;
      
      // If we haven't typed anything new, return
      if (currentPosition <= lastWordEndIndex.current) return;
      
      // Find the start of the current word
      let wordStart = currentPosition;
      while (wordStart > 0 && /[a-zA-Z-]/.test(inputText[wordStart - 1])) {
        wordStart--;
      }

      // Find the end of the current word in the correct text
      let wordEnd = wordStart;
      while (wordEnd < currentText.length && /[a-zA-Z-]/.test(currentText[wordEnd])) {
        wordEnd++;
      }

      // If we're still typing the word (haven't reached a non-word character), return
      if (currentPosition < wordEnd) return;

      // Get the complete word from both input and correct text
      const typedWord = inputText.slice(wordStart, currentPosition);
      const correctWord = currentText.slice(wordStart, wordEnd);

      // Only speak if:
      // 1. The word contains at least one letter
      // 2. We've typed the entire word
      // 3. The word is correct
      // 4. We haven't spoken this word yet
      if (
        /[a-zA-Z]/.test(typedWord) && 
        typedWord === correctWord &&
        wordStart > lastWordEndIndex.current
      ) {
        speakWord(correctWord);
        lastWordEndIndex.current = wordEnd;
      }
    } else {
      // Chinese mode: speak immediately when a character is typed correctly
      const currentPosition = inputText.length - 1;
      // 只在新输入字符时检查
      if (currentPosition >= 0 && currentPosition >= lastWordEndIndex.current) {
        const currentChar = currentText[currentPosition];
        // 检查当前字符是否正确输入且是汉字
        if (inputText[currentPosition] === currentChar && /[\u4e00-\u9fa5]/.test(currentChar)) {
          speakWord(currentChar);
          lastWordEndIndex.current = currentPosition + 1;
        }
      }
    }
  }, [inputText, currentText, isEnglish, enableSound]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getHighlightColor = (index: number) => {
    if (index >= inputText.length) return 'text-gray-800';
    return inputText[index] === currentText[index]
      ? 'text-green-500'
      : 'text-red-500';
  };

  const handleNextChallenge = () => {
    setShowCompletionModal(false);
    resetText();
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">KBPlayer</h1>
          <div className="flex items-center gap-4">
            <div className="flex gap-6 text-sm">
              <div>
                <span className="text-gray-700 font-medium">Time:</span>{' '}
                <span className="text-gray-700 font-medium">{formatTime(elapsedTime)}</span>
              </div>
              <div>
                <span className="text-gray-700 font-medium">APM:</span>{' '}
                <span className={getApmColor(apm)}>{apm}</span>
              </div>
              <div>
                <span className="text-gray-700 font-medium">Streak:</span>{' '}
                <span className={getStreakColor(streak)}>{streak}</span>
              </div>
            </div>
            <button
              onClick={() => setShowHistoryModal(true)}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <ClockIcon className="h-6 w-6" />
            </button>
            <button
              onClick={toggleSettings}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <Cog6ToothIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Example Text */}
        <div
          className={`bg-white rounded-lg p-6 shadow-sm ${
            useBoldText ? 'font-bold' : 'font-normal'
          }`}
          style={{ fontSize: `${fontSize}px` }}
        >
          {currentText.split('').map((char, index) => (
            <motion.span
              key={index}
              className={getHighlightColor(index)}
              initial={false}
              animate={{
                scale: index === inputText.length ? 1.1 : 1,
              }}
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* Input Area */}
        <textarea
          value={inputText}
          onChange={handleInputChange}
          className={`w-full p-6 bg-white rounded-lg shadow-sm resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 ${
            useBoldText ? 'font-bold' : 'font-normal'
          }`}
          style={{
            fontSize: `${fontSize}px`,
            height: `${inputHeight}px`,
            minHeight: '100px',
            maxHeight: '500px',
          }}
          placeholder="Start typing here..."
        />

        {/* Virtual Keyboard */}
        <VirtualKeyboard />
      </div>

      {/* Settings Panel */}
      <SettingsPanel />

      {/* Speed Milestone */}
      <SpeedMilestone apm={apm} />

      {/* Completion Modal */}
      <CompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        onNextChallenge={handleNextChallenge}
        stats={{
          time: formatTime(elapsedTime),
          apm,
          maxStreak,
        }}
      />

      {/* History Modal */}
      <HistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
      />
    </main>
  );
}
