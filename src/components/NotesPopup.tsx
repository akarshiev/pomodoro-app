import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Notes } from './Notes';

interface NotesPopupProps {
  open: boolean;
  onClose: () => void;
  notes: string;
  onUpdate: (notes: string) => void;
}

export const NotesPopup: React.FC<NotesPopupProps> = ({
  open,
  onClose,
  notes,
  onUpdate,
}) => {
  if (!open) return null;

  return (
    <div className="fixed bottom-16 right-4 z-50 w-80 glass-card rounded-xl p-4 fade-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">Notes</h3>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <Notes notes={notes} onUpdate={onUpdate} />
    </div>
  );
};
