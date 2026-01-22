import { useState, useEffect, useCallback } from 'react';

export interface Task {
  id: string;
  name: string;
  plannedPomodoros: number;
  completedPomodoros: number;
  isCompleted: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'pomodoro_tasks';

const loadTasks = (): Task[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return [];
};

const saveTasks = (tasks: Task[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = useCallback((name: string, plannedPomodoros: number = 1) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      name,
      plannedPomodoros,
      completedPomodoros: 0,
      isCompleted: false,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks(prev => [...prev, newTask]);
    return newTask;
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    if (activeTaskId === id) {
      setActiveTaskId(null);
    }
  }, [activeTaskId]);

  const incrementPomodoro = useCallback((id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id !== id) return task;
      const newCompleted = task.completedPomodoros + 1;
      return {
        ...task,
        completedPomodoros: newCompleted,
        isCompleted: newCompleted >= task.plannedPomodoros,
      };
    }));
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
    ));
  }, []);

  const activeTask = tasks.find(t => t.id === activeTaskId) || null;

  const todayTasks = tasks.filter(t => t.createdAt === new Date().toISOString().split('T')[0]);

  return {
    tasks,
    todayTasks,
    activeTask,
    activeTaskId,
    setActiveTaskId,
    addTask,
    updateTask,
    deleteTask,
    incrementPomodoro,
    toggleComplete,
  };
};
