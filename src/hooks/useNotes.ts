import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'pomodoro_notes';

export const useNotes = () => {
  const [notes, setNotes] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY) || '';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, notes);
  }, [notes]);

  const updateNotes = useCallback((value: string) => {
    setNotes(value);
  }, []);

  const clearNotes = useCallback(() => {
    setNotes('');
  }, []);

  return { notes, updateNotes, clearNotes };
};
