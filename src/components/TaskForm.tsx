
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTaskStore } from "@/store/taskStore";
import { useCreatureStore } from "@/store/creatureStore";
import { Badge } from "@/components/ui/badge";

interface TaskFormProps {
  onClose: () => void;
  editTask?: any;
}

export const TaskForm = ({ onClose, editTask }: TaskFormProps) => {
  const [title, setTitle] = useState(editTask?.title || "");
  const [description, setDescription] = useState(editTask?.description || "");
  const [deadline, setDeadline] = useState(editTask?.deadline || "");
  const [completionGoal, setCompletionGoal] = useState<number>(editTask?.completionGoal || 1);
  const [measurementUnit, setMeasurementUnit] = useState<'hours' | 'exercises' | 'pages' | 'custom'>(editTask?.measurementUnit || 'hours');
  const [customUnit, setCustomUnit] = useState(editTask?.customUnit || "");
  const [sharedWith, setSharedWith] = useState(editTask?.sharedWith?.join(', ') || "");
  const [selectedCreatureId, setSelectedCreatureId] = useState(editTask?.associatedCreatureId || "");
  const [createNewCreature, setCreateNewCreature] = useState(false);
  const [newCreatureCategory, setNewCreatureCategory] = useState("");

  const { addTask, updateTask } = useTaskStore();
  const { creatures, addTaskToCreature, createCreature } = useCreatureStore();

  const categories = [
    { value: 'music', label: 'Music', emoji: '🎵' },
    { value: 'study', label: 'Study', emoji: '📚' },
    { value: 'fitness', label: 'Fitness', emoji: '💪' },
    { value: 'art', label: 'Art', emoji: '🎨' },
    { value: 'cooking', label: 'Cooking', emoji: '🍳' },
    { value: 'reading', label: 'Reading', emoji: '📖' },
    { value: 'gaming', label: 'Gaming', emoji: '🎮' },
    { value: 'language', label: 'Language', emoji: '🗣️' },
    { value: 'coding', label: 'Coding', emoji: '💻' },
    { value: 'garden', label: 'Gardening', emoji: '🌱' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !deadline || !completionGoal || completionGoal <= 0) {
      console.log("Validation failed:", { title, deadline, completionGoal });
      return;
    }

    const sharedWithArray = sharedWith.trim() 
      ? sharedWith.split(',').map(email => email.trim()) 
      : undefined;

    const taskData = {
      title: title.trim(),
      description: description.trim() || undefined,
      deadline,
      completionGoal: Number(completionGoal),
      measurementUnit,
      customUnit: measurementUnit === 'custom' ? customUnit.trim() : undefined,
      sharedWith: sharedWithArray,
    };

    let task;
    if (editTask) {
      task = updateTask(editTask.id, taskData);
    } else {
      task = addTask(taskData);
    }

    // Handle creature association
    if (task) {
      if (createNewCreature && newCreatureCategory) {
        const creature = createCreature(newCreatureCategory, task.id);
      } else if (selectedCreatureId) {
        addTaskToCreature(selectedCreatureId, task.id);
      }
    }

    onClose();
  };

  const handleCompletionGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setCompletionGoal(0);
    } else {
      const numValue = Number(value);
      if (!isNaN(numValue) && numValue > 0) {
        setCompletionGoal(numValue);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          {editTask ? 'Edit Task' : 'Create New Task'}
        </h2>
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
              value={completionGoal || ''}
              onChange={handleCompletionGoalChange}
              min={measurementUnit === 'hours' ? 0.1 : 1}
              step={measurementUnit === 'hours' ? 0.5 : 1}
              required
              className="mt-1"
              placeholder="Enter amount needed"
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

        {/* Creature Assignment */}
        <div className="space-y-4">
          <Label>Creature Assignment</Label>
          
          <div className="flex gap-3">
            <Button
              type="button"
              variant={!createNewCreature ? "default" : "outline"}
              onClick={() => setCreateNewCreature(false)}
              className="flex-1"
            >
              Use Existing Creature
            </Button>
            <Button
              type="button"
              variant={createNewCreature ? "default" : "outline"}
              onClick={() => setCreateNewCreature(true)}
              className="flex-1"
            >
              Create New Creature
            </Button>
          </div>

          {createNewCreature ? (
            <div>
              <Label htmlFor="category">New Creature Type</Label>
              <Select value={newCreatureCategory} onValueChange={setNewCreatureCategory}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose creature type" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <div className="flex items-center gap-2">
                        <span>{cat.emoji}</span>
                        <span>{cat.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div>
              <Label htmlFor="creature">Select Existing Creature</Label>
              <Select value={selectedCreatureId} onValueChange={setSelectedCreatureId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose a creature" />
                </SelectTrigger>
                <SelectContent>
                  {creatures.map((creature) => (
                    <SelectItem key={creature.id} value={creature.id}>
                      <div className="flex items-center gap-2">
                        <span>{creature.appearance.emoji}</span>
                        <span>{creature.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          Lv.{creature.level}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

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
            {editTask ? 'Update Task' : 'Create Task'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
