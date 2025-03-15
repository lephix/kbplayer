import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SpeedMilestoneProps {
  apm: number;
}

export const SpeedMilestone: React.FC<SpeedMilestoneProps> = ({ apm }) => {
  const [showMilestone, setShowMilestone] = useState(false);
  const [milestone, setMilestone] = useState('');
  const [lastAchievedMilestone, setLastAchievedMilestone] = useState(0);

  useEffect(() => {
    let newMilestone = '';
    let milestoneLevel = 0;

    if (apm >= 100) {
      newMilestone = '🏆 Amazing! 100+ APM';
      milestoneLevel = 100;
    } else if (apm >= 80) {
      newMilestone = '🌟 Great! 80+ APM';
      milestoneLevel = 80;
    } else if (apm >= 60) {
      newMilestone = '⭐ Good! 60+ APM';
      milestoneLevel = 60;
    }

    // Only show milestone if it's higher than the last achieved one
    if (milestoneLevel > lastAchievedMilestone) {
      setMilestone(newMilestone);
      setLastAchievedMilestone(milestoneLevel);
      setShowMilestone(true);
      const timer = setTimeout(() => setShowMilestone(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [apm, lastAchievedMilestone]);

  if (!showMilestone) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg text-lg font-medium"
      >
        {milestone}
      </motion.div>
    </AnimatePresence>
  );
}; 