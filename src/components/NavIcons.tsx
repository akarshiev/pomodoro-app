import React from 'react';
import { Timer, TrendingUp, Share2 } from 'lucide-react';

type Section = 'pomodoro' | 'progress' | 'share';

interface NavIconsProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

export const NavIcons: React.FC<NavIconsProps> = ({ activeSection, onSectionChange }) => {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onSectionChange('pomodoro')}
        className={`nav-icon-red ${activeSection === 'pomodoro' ? 'ring-2 ring-offset-2 ring-nav-red scale-110' : 'opacity-80'}`}
        aria-label="Pomodoro Timer"
      >
        <Timer className="w-5 h-5 text-primary-foreground" />
      </button>
      <button
        onClick={() => onSectionChange('progress')}
        className={`nav-icon-blue ${activeSection === 'progress' ? 'ring-2 ring-offset-2 ring-nav-blue scale-110' : 'opacity-80'}`}
        aria-label="Year Progress"
      >
        <TrendingUp className="w-5 h-5 text-primary-foreground" />
      </button>
      <button
        onClick={() => onSectionChange('share')}
        className={`nav-icon-green ${activeSection === 'share' ? 'ring-2 ring-offset-2 ring-nav-green scale-110' : 'opacity-80'}`}
        aria-label="Share Results"
      >
        <Share2 className="w-5 h-5 text-primary-foreground" />
      </button>
    </div>
  );
};
