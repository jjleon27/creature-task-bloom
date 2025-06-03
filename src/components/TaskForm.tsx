
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTaskStore } from "@/store/taskStore";

interface TaskFormProps {
  onClose: () => void;
}

export const TaskForm = ({ onClose }: TaskFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [completionGoal, setCompletionGoal] = useState<number>(1);
  const [measurementUnit, setMeasurementUnit] = useState<'hours' | 'exercises' | 'pages' | 'custom'>('hours');
  const [customUnit, setCustomUnit] = useState("");
  const [sharedWith, setSharedWith] = useState("");

  const { addTask } = useTaskStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !deadline || completionGoal <= 0) {
      return;
    }

    const sharedWithArray = sharedWith.trim() 
      ? sharedWith.split(',').map(email => email.trim()) 
      : undefined;

    addTask({
      title,
      description: description || undefined,
      deadline,
      completionGoal,
      measurementUnit,
      customUnit: measurementUnit === 'custom' ? customUnit : undefined,
      sharedWith: sharedWithArray,
    });

    onClose();
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Create New Task</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X size={20} />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="title">Task Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Study for Math Exam"
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional details about the task..."
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="deadline">Deadline *</Label>
          <Input
            id="deadline"
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="measurementUnit">Measurement Unit</Label>
            <Select value={measurementUnit} onValueChange={(value) => setMeasurementUnit(value as any)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="exercises">Exercises</SelectItem>
                <SelectItem value="pages">Pages</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="completionGoal">
              {measurementUnit === 'custom' ? 'Goal Amount' : `${measurementUnit.charAt(0).toUpperCase() + measurementUnit.slice(1)} Needed`} *
            </Label>
            <Input
              id="completionGoal"
              type="number"
              value={completionGoal}
              onChange={(e) => setCompletionGoal(Number(e.target.value))}
              min={0.1}
              step={measurementUnit === 'hours' ? 0.5 : 1}
              required
              className="mt-1"
            />
          </div>
        </div>

        {measurementUnit === 'custom' && (
          <div>
            <Label htmlFor="customUnit">Custom Unit Name</Label>
            <Input
              id="customUnit"
              value={customUnit}
              onChange={(e) => setCustomUnit(e.target.value)}
              placeholder="e.g., chapters, problems, modules"
              className="mt-1"
            />
          </div>
        )}

        <div>
          <Label htmlFor="sharedWith">Share with Friends</Label>
          <Input
            id="sharedWith"
            value={sharedWith}
            onChange={(e) => setSharedWith(e.target.value)}
            placeholder="Enter email addresses, separated by commas"
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Optional: Share this task with friends for collaboration
          </p>
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="flex-1">
            Create Task
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
