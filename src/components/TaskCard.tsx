
import { useState } from "react";
import { Play, Users, Edit, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Task, useTaskStore } from "@/store/taskStore";
import { FocusModal } from "@/components/FocusModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

export const TaskCard = ({ task, onEdit }: TaskCardProps) => {
  const [showFocusModal, setShowFocusModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { deleteTask } = useTaskStore();
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

  const handleDelete = () => {
    deleteTask(task.id);
    setShowDeleteDialog(false);
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
          
          <div className="flex items-center gap-2">
            {task.sharedWith && task.sharedWith.length > 0 && (
              <div className="flex items-center text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                <Users size={14} className="mr-1" />
                <span className="text-xs">{task.sharedWith.length}</span>
              </div>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onEdit?.(task)}>
                  <Edit size={14} className="mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-600"
                >
                  <Trash2 size={14} className="mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{task.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
