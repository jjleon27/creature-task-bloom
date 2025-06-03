
import { useState } from "react";
import { Play, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Task, useTaskStore } from "@/store/taskStore";
import { FocusModal } from "@/components/FocusModal";

interface TaskCardProps {
  task: Task;
}

export const TaskCard = ({ task }: TaskCardProps) => {
  const [showFocusModal, setShowFocusModal] = useState(false);
  const progressPercentage = (task.currentProgress / task.completionGoal) * 100;

  const getUnitDisplay = () => {
    if (task.measurementUnit === 'custom' && task.customUnit) {
      return task.customUnit;
    }
    return task.measurementUnit;
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    if (diffDays > 0) return `Due in ${diffDays} days`;
    return `Overdue by ${Math.abs(diffDays)} days`;
  };

  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{task.title}</h3>
            {task.description && (
              <p className="text-gray-600 text-sm mb-2">{task.description}</p>
            )}
            <p className="text-sm text-gray-500">{formatDeadline(task.deadline)}</p>
          </div>
          {task.sharedWith && task.sharedWith.length > 0 && (
            <div className="flex items-center text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
              <Users size={14} className="mr-1" />
              <span className="text-xs">{task.sharedWith.length}</span>
            </div>
          )}
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-medium">
              {task.currentProgress} / {task.completionGoal} {getUnitDisplay()}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <Button
          onClick={() => setShowFocusModal(true)}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
          disabled={task.isCompleted}
        >
          <Play size={16} className="mr-2" />
          {task.isCompleted ? "Completed!" : "Start Focusing"}
        </Button>
      </div>

      <FocusModal
        isOpen={showFocusModal}
        onClose={() => setShowFocusModal(false)}
        task={task}
      />
    </>
  );
};
