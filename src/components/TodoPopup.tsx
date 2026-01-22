import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskList } from './TaskList';
import { Task } from '@/hooks/useTasks';

interface TodoPopupProps {
  open: boolean;
  onClose: () => void;
  tasks: Task[];
  activeTaskId: string | null;
  onAddTask: (name: string, plannedPomodoros: number) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onSelectTask: (id: string | null) => void;
  onToggleComplete: (id: string) => void;
}

export const TodoPopup: React.FC<TodoPopupProps> = ({
  open,
  onClose,
  tasks,
  activeTaskId,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onSelectTask,
  onToggleComplete,
}) => {
  if (!open) return null;

  return (
    <div className="fixed bottom-16 right-4 z-50 w-80 max-h-96 glass-card rounded-xl p-4 fade-in overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">Todo</h3>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="overflow-y-auto max-h-72">
        <TaskList
          tasks={tasks}
          activeTaskId={activeTaskId}
          onAddTask={onAddTask}
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
          onSelectTask={onSelectTask}
          onToggleComplete={onToggleComplete}
        />
      </div>
    </div>
  );
};
