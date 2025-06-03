
import { useState } from "react";
import { Plus } from "lucide-react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { FriendsButton } from "@/components/FriendsButton";
import { RewardsButton } from "@/components/RewardsButton";
import { Button } from "@/components/ui/button";
import { TaskForm } from "@/components/TaskForm";

const Tasks = () => {
  const [showTaskForm, setShowTaskForm] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="relative">
        <RewardsButton />
        <FriendsButton />
      </div>
      
      <div className="p-6 pb-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Task Input</h1>
            <p className="text-gray-600">Create and manage your tasks</p>
          </div>
          
          <Button
            onClick={() => setShowTaskForm(true)}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
          >
            <Plus size={20} className="mr-2" />
            New Task
          </Button>
        </div>

        {showTaskForm && (
          <TaskForm onClose={() => setShowTaskForm(false)} />
        )}
      </div>

      <BottomNavigation currentPage="tasks" />
    </div>
  );
};

export default Tasks;
