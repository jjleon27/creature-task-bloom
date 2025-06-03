
import { useState, useEffect } from "react";
import { Timer, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Task, useTaskStore } from "@/store/taskStore";

interface FocusModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
}

export const FocusModal = ({ isOpen, onClose, task }: FocusModalProps) => {
  const [duration, setDuration] = useState(25);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [progressToAdd, setProgressToAdd] = useState(1);
  const { startFocusSession, endFocusSession, updateTaskProgress, addVirtualCurrency } = useTaskStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((time) => {
          if (time <= 1) {
            handleSessionComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  const startFocus = () => {
    const sessionId = Date.now().toString();
    setTimeRemaining(duration * 60);
    setIsActive(true);
    startFocusSession(task.id, duration);
  };

  const handleSessionComplete = () => {
    setIsActive(false);
    const newProgress = Math.min(task.completionGoal, task.currentProgress + progressToAdd);
    updateTaskProgress(task.id, newProgress);
    addVirtualCurrency(duration);
    endFocusSession(Date.now().toString(), true);
    onClose();
  };

  const handleEarlyExit = () => {
    setIsActive(false);
    endFocusSession(Date.now().toString(), false);
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getUnitDisplay = () => {
    if (task.measurementUnit === 'custom' && task.customUnit) {
      return task.customUnit;
    }
    return task.measurementUnit;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Timer className="mr-2" />
            Focus Session
          </DialogTitle>
        </DialogHeader>

        {!isActive ? (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">{task.title}</h3>
              <p className="text-sm text-gray-600">
                Current progress: {task.currentProgress} / {task.completionGoal} {getUnitDisplay()}
              </p>
            </div>

            <div>
              <Label htmlFor="duration">Focus Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min={1}
                max={120}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="progress">Progress to add after session</Label>
              <Input
                id="progress"
                type="number"
                value={progressToAdd}
                onChange={(e) => setProgressToAdd(Number(e.target.value))}
                min={0.1}
                step={task.measurementUnit === 'hours' ? 0.5 : 1}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                How many {getUnitDisplay()} will you complete in this session?
              </p>
            </div>

            <Button onClick={startFocus} className="w-full">
              Start Focus Session
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="text-6xl font-mono text-blue-600">
              {formatTime(timeRemaining)}
            </div>
            
            <div className="space-y-2">
              <p className="text-lg font-medium">Focusing on: {task.title}</p>
              <p className="text-sm text-gray-600">
                Will add {progressToAdd} {getUnitDisplay()} when complete
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700 mb-2">
                ⚠️ Warning: Exiting early will hurt your creature!
              </p>
              <Button
                onClick={handleEarlyExit}
                variant="destructive"
                size="sm"
                className="w-full"
              >
                <X className="mr-2" size={16} />
                End Session Early
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
