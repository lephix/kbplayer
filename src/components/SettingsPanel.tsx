import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTypingStore } from '@/store/useTypingStore';

export const SettingsPanel: React.FC = () => {
  const {
    settings,
    toggleLanguage,
    toggleKeyHints,
    toggleSound,
    toggleBoldText,
    setFontSize,
    setInputHeight,
    toggleSettings,
  } = useTypingStore();

  const {
    isEnglish,
    showKeyHints,
    enableSound,
    fontSize,
    useBoldText,
    inputHeight,
    isSettingsOpen,
  } = settings;

  return (
    <Transition show={isSettingsOpen} as={React.Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={toggleSettings}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Settings
                </Dialog.Title>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500"
                  onClick={toggleSettings}
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Language Toggle */}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Language
                  </span>
                  <button
                    onClick={toggleLanguage}
                    className={`px-4 py-2 rounded-md ${
                      isEnglish
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {isEnglish ? 'English' : '中文'}
                  </button>
                </div>

                {/* Key Hints Toggle */}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Show Key Hints
                  </span>
                  <button
                    onClick={toggleKeyHints}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      showKeyHints ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        showKeyHints ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Sound Toggle */}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Word Pronunciation
                  </span>
                  <button
                    onClick={toggleSound}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      enableSound ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        enableSound ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Bold Text Toggle */}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Bold Example Text
                  </span>
                  <button
                    onClick={toggleBoldText}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      useBoldText ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        useBoldText ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Font Size Slider */}
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">
                    Font Size: {fontSize}px
                  </span>
                  <input
                    type="range"
                    min="12"
                    max="24"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Input Height Slider */}
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">
                    Input Height: {inputHeight}px
                  </span>
                  <input
                    type="range"
                    min="100"
                    max="300"
                    step="10"
                    value={inputHeight}
                    onChange={(e) => setInputHeight(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}; 