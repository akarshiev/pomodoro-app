import React, {useMemo} from 'react';
import {TimerMode} from '@/hooks/usePomodoro';

const focusQuotes = [
    // "Small changes, big goals.",
    // "Every action you take is a vote for the type of person you wish to become.",
    // "You do not rise to the level of your goals. You fall to the level of your systems.",
    // "Habits are the compound interest of self-improvement.",
    // "The task of breaking a bad habit is like uprooting a powerful oak within us.",
    // "Success is the product of daily habits—not once-in-a-lifetime transformations.",
    // "Time magnifies the margin between success and failure.",
    // "Be the designer of your world and not merely the consumer of it.",
    "Maqsad - erishishni istagan natijalarimiz, Tizim esa shu natijalarga erishish jarayonidir.",
    "Maqsad haqida kecha-yu kunduz bosh qotirib, tizimni tartibga keltirishga etarlicha e'tibor bermaslik qator muammolarga sabab bo'ldi."
];

const breakQuotes = [
    "Rest. Reset. Refocus.",
    "Take a moment to breathe.",
    // "Small breaks lead to big breakthroughs.",
    // "Pause and reflect on your progress.",
    // "Your mind needs rest to perform at its best.",
    // "Enjoy this moment of calm.",
    // "Recharge for the next focused session.",
    // "Balance is the key to lasting productivity.",
];

interface QuoteDisplayProps {
    mode: TimerMode;
}

export const QuoteDisplay: React.FC<QuoteDisplayProps> = ({mode}) => {
    const quote = useMemo(() => {
        const quotes = mode === 'focus' ? focusQuotes : breakQuotes;
        return quotes[Math.floor(Math.random() * quotes.length)];
    }, [mode]);

    return (
        <p className="quote-text italic text-center text-sm text-white">
            {'"' + quote + '"'}
        </p>
    );
};
