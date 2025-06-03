
import { useState } from "react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { FriendsButton } from "@/components/FriendsButton";
import { RewardsButton } from "@/components/RewardsButton";
import { TaskCard } from "@/components/TaskCard";
import { useTaskStore } from "@/store/taskStore";

const Index = () => {
  const { tasks } = useTaskStore();
  const todayTasks = tasks.filter(task => {
    const today = new Date();
    const taskDate = new Date(task.deadline);
    return taskDate.toDateString() === today.toDateString();
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="relative">
        <RewardsButton />
        <FriendsButton />
      </div>
      
      <div className="p-6 pb-24">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Tasks</h1>
        <p className="text-gray-600 mb-8">Stay productive and help your creature grow!</p>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Today</h2>
          {todayTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No tasks for today! Add some tasks to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">All Tasks</h2>
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No tasks yet! Create your first task to begin your journey.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNavigation currentPage="home" />
    </div>
  );
};

export default Index;
