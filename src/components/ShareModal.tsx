import React from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Task } from '@/hooks/useTasks';
import { toast } from 'sonner';

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tasks: Task[];
  todayFocusedTime: number;
  todayPomodoroCount: number;
}

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

export const ShareModal: React.FC<ShareModalProps> = ({
  open,
  onOpenChange,
  tasks,
  todayFocusedTime,
  todayPomodoroCount,
}) => {
  const [copied, setCopied] = React.useState(false);

  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const todayTasks = tasks.filter(t => t.createdAt === new Date().toISOString().split('T')[0]);

  const generateShareText = () => {
    const lines = [
      today,
      '',
      '🎯 Plan & Results',
      '',
    ];

    todayTasks.forEach(task => {
      const status = task.isCompleted || task.completedPomodoros >= task.plannedPomodoros ? '✅' : '❌';
      if (task.completedPomodoros > 0) {
        lines.push(`- ${task.name} | Pomodoro: ${task.completedPomodoros} ${status}`);
      } else {
        lines.push(`- ${task.name} ${status}`);
      }
    });

    lines.push('');
    lines.push(`🍅 Total Pomodoro: ${todayPomodoroCount}`);
    lines.push(`📈 Total Time Focused: ${formatTime(todayFocusedTime)}`);
    lines.push('');
    lines.push('⚡️ Keep Learning!');

    return lines.join('\n');
  };

  const shareText = generateShareText();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card max-w-md">
        <DialogHeader>
          <DialogTitle>Share Today's Results</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <pre className="bg-muted/50 rounded-lg p-4 text-sm whitespace-pre-wrap font-mono overflow-auto max-h-80">
            {shareText}
          </pre>
          <Button onClick={handleCopy} className="w-full">
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" /> Copy to Clipboard
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
