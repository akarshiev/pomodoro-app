import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface NotesProps {
  notes: string;
  onUpdate: (value: string) => void;
}

export const Notes: React.FC<NotesProps> = ({ notes, onUpdate }) => {
  return (
    <div className="space-y-3">
      <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Notes</h3>
      <Textarea
        value={notes}
        onChange={(e) => onUpdate(e.target.value)}
        placeholder="Daily notes, reminders, or thoughts..."
        className="min-h-[100px] resize-none bg-background/50"
      />
    </div>
  );
};
