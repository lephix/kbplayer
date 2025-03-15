import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ClockIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useTypingStore } from '@/store/useTypingStore';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { history, clearHistory } = useTypingStore();

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
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
            <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-6 w-6 text-gray-500" />
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    History Records
                  </Dialog.Title>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={clearHistory}
                    className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Clear History
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="mt-4 max-h-[60vh] overflow-y-auto">
                {history.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No history records yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {history.map((record) => (
                      <div
                        key={record.id}
                        className="bg-gray-50 p-4 rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-sm text-gray-500">
                            {record.date}
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {record.isEnglish ? 'English' : '中文'}
                          </div>
                        </div>
                        <div className="text-gray-700 mb-3 line-clamp-1">
                          {record.text.length > 50 
                            ? record.text.slice(0, 50) + '...' 
                            : record.text}
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Time: </span>
                            <span className="font-medium text-blue-600">
                              {formatTime(record.time)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">APM: </span>
                            <span className={`font-medium ${
                              record.apm >= 100 ? 'text-purple-600' :
                              record.apm >= 80 ? 'text-blue-600' :
                              record.apm >= 60 ? 'text-green-600' :
                              'text-gray-900'
                            }`}>
                              {record.apm}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Max Streak: </span>
                            <span className={`font-medium ${
                              record.maxStreak >= 50 ? 'text-purple-600' :
                              record.maxStreak >= 35 ? 'text-blue-600' :
                              record.maxStreak >= 20 ? 'text-green-600' :
                              'text-gray-900'
                            }`}>
                              {record.maxStreak}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}; 