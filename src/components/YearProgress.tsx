import React, {useState, useEffect} from 'react';
import {Progress} from '@/components/ui/progress';
import {Input} from '@/components/ui/input';

export const YearProgress: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        percentage: 0,
    });
    const [dailyPomodoros, setDailyPomodoros] = useState(3);

    useEffect(() => {
        const calculateTime = () => {
            const now = new Date();
            const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
            const startOfYear = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);

            const totalMs = endOfYear.getTime() - startOfYear.getTime();
            const elapsedMs = now.getTime() - startOfYear.getTime();
            const remainingMs = endOfYear.getTime() - now.getTime();

            const percentage = (elapsedMs / totalMs) * 100;

            const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
            const hours = Math.floor((remainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

            setTimeLeft({days, hours, minutes, seconds, percentage});
        };

        calculateTime();
        const interval = setInterval(calculateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const estimatedPomodoros = Math.round(timeLeft.days * dailyPomodoros);

    return (
        <div className="space-y-8 fade-in">
            <div className="text-center">
                <h2 className="text-lg font-medium mb-4">Time Until Year End</h2>
                <Progress value={timeLeft.percentage} className="h-2 mb-2"/>
                <p className="text-sm text-muted-foreground">{timeLeft.percentage.toFixed(2)}% of the year has
                    passed</p>
            </div>

            <div className="text-center">
                <div className="grid grid-cols-4 gap-4">
                    <div className="glass-card rounded-lg p-4 text-center">
                        <div className="text-2xl font-light tabular-nums">{timeLeft.days}</div>
                        <div className="text-xs text-muted-foreground uppercase">Days</div>
                    </div>
                    <div className="glass-card rounded-lg p-4 text-center">
                        <div className="text-2xl font-light tabular-nums">{timeLeft.hours}</div>
                        <div className="text-xs text-muted-foreground uppercase">Hours</div>
                    </div>
                    <div className="glass-card rounded-lg p-4 text-center">
                        <div className="text-2xl font-light tabular-nums">{timeLeft.minutes}</div>
                        <div className="text-xs text-muted-foreground uppercase">Minutes</div>
                    </div>
                    <div className="glass-card rounded-lg p-4 text-center">
                        <div className="text-2xl font-light tabular-nums">{timeLeft.seconds}</div>
                        <div className="text-xs text-muted-foreground uppercase">Seconds</div>
                    </div>
                </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                    If you complete around{' '}
                    <Input
                        type="number"
                        min={1}
                        max={20}
                        value={dailyPomodoros}
                        onChange={(e) => setDailyPomodoros(parseInt(e.target.value) || 3)}
                        className="inline w-14 h-7 text-center mx-1"
                    />
                    pomodoros per day, you will finish approximately <strong>{estimatedPomodoros}+</strong> pomodoros by
                    the end of the year.
                </p>
            </div>
        </div>
    );
};
