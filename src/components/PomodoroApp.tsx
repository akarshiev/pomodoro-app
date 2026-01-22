import React, {useState} from 'react';
import {NavIcons} from './NavIcons';
import {PomodoroTimer} from './PomodoroTimer';
import {QuoteDisplay} from './QuoteDisplay';
import {NotesPopup} from './NotesPopup';
import {TodoPopup} from './TodoPopup';
import {YearProgress} from './YearProgress';
import {ShareModal} from './ShareModal';
import {usePomodoro} from '@/hooks/usePomodoro';
import {useTasks} from '@/hooks/useTasks';
import {useNotes} from '@/hooks/useNotes';
import natureBg from '@/assets/bg-image.jpeg';

type Section = 'pomodoro' | 'progress' | 'share';

const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
        return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
};

export const PomodoroApp: React.FC = () => {
    const [activeSection, setActiveSection] = useState<Section>('pomodoro');
    const [showShare, setShowShare] = useState(false);
    const [showNotes, setShowNotes] = useState(false);
    const [showTodo, setShowTodo] = useState(false);

    const pomodoro = usePomodoro();
    const tasks = useTasks();
    const {notes, updateNotes} = useNotes();

    const handleSectionChange = (section: Section) => {
        if (section === 'share') {
            setShowShare(true);
        } else {
            setActiveSection(section);
        }
    };

    const handleSkip = () => {
        if (pomodoro.mode === 'focus') {
            pomodoro.skipToBreak();
        } else {
            pomodoro.skipToFocus();
        }
    };

    const handleNotesToggle = () => {
        setShowNotes(!showNotes);
        if (showTodo) setShowTodo(false);
    };

    const handleTodoToggle = () => {
        setShowTodo(!showTodo);
        if (showNotes) setShowNotes(false);
    };

    return (
        <div
            className="min-h-screen w-full flex flex-col relative overflow-hidden"
            style={{
                backgroundImage: `url(${natureBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Blur overlay */}
            <div className="fixed inset-0 backdrop-blur-lg "/>

            {/* Top bar */}
            <div className="relative z-10 flex items-center justify-between p-4">
                <NavIcons activeSection={activeSection} onSectionChange={handleSectionChange}/>

                {activeSection === 'pomodoro' && (
                    <div className="text-center">
                        <div className="text-2xl font-light">{formatTime(pomodoro.todayFocusedTime)}</div>
                        <div className="text-sm text-black/50 font-semibold">Total time spent today.</div>
                    </div>
                )}
            </div>

            {/* Main content */}
            <div className="relative z-10 flex-1 flex items-center justify-center">
                {activeSection === 'pomodoro' && (
                    <PomodoroTimer
                        mode={pomodoro.mode}
                        timeRemaining={pomodoro.timeRemaining}
                        isRunning={pomodoro.isRunning}
                        currentPomodoro={pomodoro.currentPomodoro}
                        totalPomodoros={4}
                        progress={pomodoro.progress}
                        activeTask={tasks.activeTask}
                        onToggle={pomodoro.toggleTimer}
                        onSkip={handleSkip}
                    />
                )}

                {activeSection === 'progress' && (
                    <div className="w-full max-w-2xl px-4">
                        <div className="glass-card rounded-2xl p-8">
                            <YearProgress/>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom bar */}
            {activeSection === 'pomodoro' && (
                <div className="relative z-10 p-4 flex items-end justify-between">
                    {/* Quote on the left/center */}
                    <div className="flex-1 flex justify-center">
                        <QuoteDisplay mode={pomodoro.mode}/>
                    </div>

                    {/* Notes & Todo buttons on the right */}
                    <div className="flex gap-4 text-sm">
                        <button
                            onClick={handleNotesToggle}
                            className={`text-white/70 hover:text-white ${showNotes ? 'text-foreground font-medium' : 'text-muted-foreground'}`}
                        >
                            Notes
                        </button>
                        <button
                            onClick={handleTodoToggle}
                            className={`text-white/70 hover:text-white ${showTodo ? 'text-foreground font-medium' : 'text-muted-foreground'}`}
                        >
                            Todo
                        </button>
                    </div>
                </div>
            )}

            {/* Popups */}
            <NotesPopup
                open={showNotes}
                onClose={() => setShowNotes(false)}
                notes={notes}
                onUpdate={updateNotes}
            />

            <TodoPopup
                open={showTodo}
                onClose={() => setShowTodo(false)}
                tasks={tasks.todayTasks}
                activeTaskId={tasks.activeTaskId}
                onAddTask={tasks.addTask}
                onUpdateTask={tasks.updateTask}
                onDeleteTask={tasks.deleteTask}
                onSelectTask={tasks.setActiveTaskId}
                onToggleComplete={tasks.toggleComplete}
            />

            <ShareModal
                open={showShare}
                onOpenChange={setShowShare}
                tasks={tasks.tasks}
                todayFocusedTime={pomodoro.todayFocusedTime}
                todayPomodoroCount={pomodoro.todayPomodoroCount}
            />
        </div>
    );
};
