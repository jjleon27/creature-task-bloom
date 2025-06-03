
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreatureStore } from "@/store/creatureStore";

interface CreateCreatureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateCreatureModal = ({ isOpen, onClose }: CreateCreatureModalProps) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const { createCreature } = useCreatureStore();

  if (!isOpen) return null;

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
    
    if (!category) return;

    const creature = createCreature(category);
    if (name.trim()) {
      // Update creature name if provided
      creature.name = name.trim();
    }
    
    onClose();
    setName("");
    setCategory("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-xl border border-gray-200 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Create New Creature</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="category">Creature Type *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Choose a creature type" />
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

          <div>
            <Label htmlFor="name">Custom Name (Optional)</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Leave empty for auto-generated name"
              className="mt-1"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={!category}>
              Create Creature
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
