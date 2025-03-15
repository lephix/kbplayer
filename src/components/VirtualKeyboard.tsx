import React from 'react';
import { motion } from 'framer-motion';
import { useTypingStore } from '@/store/useTypingStore';

const keyboardLayout = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
  ['Ctrl', 'Alt', 'Space', 'Alt', 'Ctrl']
];

interface KeyProps {
  char: string;
  isHighlighted: boolean;
  width?: string;
}

const Key: React.FC<KeyProps> = ({ char, isHighlighted, width = 'w-12' }) => {
  const baseClasses = `h-12 rounded-lg flex items-center justify-center text-base font-medium 
    transition-colors duration-200 ${width}`;
  
  const colorClasses = isHighlighted
    ? 'bg-blue-500 text-white shadow-lg'
    : 'bg-gray-200 text-gray-700 hover:bg-gray-300';

  return (
    <motion.div
      className={`${baseClasses} ${colorClasses}`}
      whileTap={{ scale: 0.95 }}
      initial={false}
      animate={{
        scale: isHighlighted ? 1.1 : 1,
        backgroundColor: isHighlighted ? '#3B82F6' : '#E5E7EB'
      }}
    >
      {char}
    </motion.div>
  );
};

export const VirtualKeyboard: React.FC = () => {
  const { currentText, inputText, settings: { showKeyHints } } = useTypingStore();
  
  const nextChar = currentText[inputText.length] || '';
  const nextCharLower = nextChar.toLowerCase();

  const getKeyWidth = (key: string) => {
    switch (key) {
      case 'Backspace':
        return 'w-20';
      case 'Tab':
      case 'Caps':
      case '\\':
        return 'w-16';
      case 'Enter':
        return 'w-20';
      case 'Shift':
        return 'w-24';
      case 'Space':
        return 'w-80';
      case 'Ctrl':
      case 'Alt':
        return 'w-14';
      default:
        return 'w-12';
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-xl shadow-inner">
      <div className="flex flex-col gap-2">
        {keyboardLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2 justify-center">
            {row.map((key, keyIndex) => (
              <Key
                key={`${rowIndex}-${keyIndex}`}
                char={key}
                width={getKeyWidth(key)}
                isHighlighted={showKeyHints && key.toLowerCase() === nextCharLower}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}; 