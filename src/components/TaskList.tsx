import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Task } from '@/hooks/useTasks';

interface TaskListProps {
  tasks: Task[];
  activeTaskId: string | null;
  onAddTask: (name: string, pomodoros: number) => void;
  onUpdateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  onDeleteTask: (id: string) => void;
  onSelectTask: (id: string | null) => void;
  onToggleComplete: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  activeTaskId,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onSelectTask,
  onToggleComplete,
}) => {
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskPomodoros, setNewTaskPomodoros] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPomodoros, setEditPomodoros] = useState(1);

  const handleAdd = () => {
    if (newTaskName.trim()) {
      onAddTask(newTaskName.trim(), newTaskPomodoros);
      setNewTaskName('');
      setNewTaskPomodoros(1);
    }
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditName(task.name);
    setEditPomodoros(task.plannedPomodoros);
  };

  const saveEdit = (id: string) => {
    if (editName.trim()) {
      onUpdateTask(id, { name: editName.trim(), plannedPomodoros: editPomodoros });
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">ToDo</h3>
      
      <div className="flex gap-2">
        <Input
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          placeholder="New task..."
          className="flex-1"
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <Input
          type="number"
          min={1}
          max={10}
          value={newTaskPomodoros}
          onChange={(e) => setNewTaskPomodoros(parseInt(e.target.value) || 1)}
          className="w-16 text-center"
        />
        <Button size="icon" onClick={handleAdd}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
              activeTaskId === task.id ? 'bg-muted' : 'hover:bg-muted/50'
            } ${task.isCompleted ? 'opacity-60' : ''}`}
          >
            {editingId === task.id ? (
              <>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 h-8"
                  autoFocus
                />
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={editPomodoros}
                  onChange={(e) => setEditPomodoros(parseInt(e.target.value) || 1)}
                  className="w-14 h-8 text-center"
                />
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => saveEdit(task.id)}>
                  <Check className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingId(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onToggleComplete(task.id)}
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    task.isCompleted ? 'bg-foreground border-foreground' : 'border-border hover:border-foreground'
                  }`}
                >
                  {task.isCompleted && <Check className="w-3 h-3 text-background" />}
                </button>
                <span className={`flex-1 text-sm truncate ${task.isCompleted ? 'line-through' : ''}`}>
                  {task.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {task.completedPomodoros}/{task.plannedPomodoros}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => onSelectTask(activeTaskId === task.id ? null : task.id)}
                  title="Set as active task"
                >
                  <Target className={`w-4 h-4 ${activeTaskId === task.id ? 'text-nav-red' : ''}`} />
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => startEdit(task)}>
                  <Edit2 className="w-3 h-3" />
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onDeleteTask(task.id)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </>
            )}
          </div>
        ))}
        {tasks.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No tasks yet</p>
        )}
      </div>
    </div>
  );
};
