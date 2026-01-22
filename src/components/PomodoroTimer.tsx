import React, {useState} from 'react';
import {CircularProgress} from './CircularProgress';
import {Button} from '@/components/ui/button';
import {Task} from '@/hooks/useTasks';
import {TimerMode} from '@/hooks/usePomodoro';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface PomodoroTimerProps {
    mode: TimerMode;
    timeRemaining: number;
    isRunning: boolean;
    currentPomodoro: number;
    totalPomodoros: number;
    progress: number;
    activeTask: Task | null;
    onToggle: () => void;
    onSkip: () => void;
}

const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
                                                                mode,
                                                                timeRemaining,
                                                                isRunning,
                                                                currentPomodoro,
                                                                totalPomodoros,
                                                                progress,
                                                                activeTask,
                                                                onToggle,
                                                                onSkip,
                                                            }) => {
    const [showSkipConfirm, setShowSkipConfirm] = useState(false);

    const handleSkipClick = () => {
        if (mode === 'focus' && isRunning) {
            setShowSkipConfirm(true);
        } else {
            onSkip();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <CircularProgress progress={progress} size={480} strokeWidth={4}>
                <div className="flex flex-col items-center gap-4">
                    {/* Mode tabs */}
                    <div className="flex gap-8 text-sm tracking-widest">
            <span className={`uppercase ${mode === 'focus' ? 'text-foreground font-semibold' : 'text-foreground/70'}`}>
              Focus
            </span>
                        <span
                            className={`uppercase ${mode === 'break' ? 'text-foreground font-semibold' : 'text-foreground/70'}`}>
              Break
            </span>
                    </div>

                    {/* Large time display */}
                    <div className="text-8xl md:text-9xl tracking-tight tabular-nums text-foreground font-bold">
                        {formatTime(timeRemaining)}
                    </div>

                    {/* Current mode label */}
                    <div className="text-3xl font-bold text-foreground/80 capitalize">
                        {mode}
                    </div>

                    {/* Pause/Start button */}
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={onToggle}
                        className="px-10 py-3 text-sm uppercase tracking-widest rounded-full border-foreground/30 hover:bg-foreground/10"
                    >
                        {isRunning ? 'Pause' : 'Start'}
                    </Button>
                </div>
            </CircularProgress>

            {/* Active task indicator - positioned below */}
            {activeTask && (
                <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground">
                        {activeTask.name} • {activeTask.completedPomodoros}/{activeTask.plannedPomodoros}
                    </p>
                </div>
            )}

            <AlertDialog open={showSkipConfirm} onOpenChange={setShowSkipConfirm}>
                <AlertDialogContent className="glass-card">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Skip to break?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to skip this focus session? Your progress will not be saved.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSkipClick}>Skip</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
