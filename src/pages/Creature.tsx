
import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { FriendsButton } from "@/components/FriendsButton";
import { RewardsButton } from "@/components/RewardsButton";
import { CreatureCard } from "@/components/CreatureCard";
import { Button } from "@/components/ui/button";
import { useCreatureStore } from "@/store/creatureStore";
import { useTaskStore } from "@/store/taskStore";
import { CreateCreatureModal } from "@/components/CreateCreatureModal";

const Creature = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { creatures, selectedCreatureId, selectCreature } = useCreatureStore();
  const { tasks } = useTaskStore();
  
  const selectedCreature = creatures.find(c => c.id === selectedCreatureId);
  const totalExperience = creatures.reduce((sum, creature) => sum + creature.experience + (creature.level * 100), 0);
  const averageHealth = creatures.length > 0 ? creatures.reduce((sum, creature) => sum + creature.health, 0) / creatures.length : 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="relative">
        <RewardsButton />
        <FriendsButton />
      </div>
      
      <div className="p-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Creature Forest</h1>
            <p className="text-gray-600">Your loyal companions grow with every completed task!</p>
          </div>
          
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
          >
            <Plus size={20} className="mr-2" />
            New Creature
          </Button>
        </div>

        {/* Forest Stats */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-yellow-500" size={24} />
            <h2 className="text-xl font-semibold text-gray-800">Forest Overview</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{creatures.length}</div>
              <div className="text-sm text-gray-600">Creatures</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{Math.round(averageHealth)}%</div>
              <div className="text-sm text-gray-600">Avg Health</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">{totalExperience}</div>
              <div className="text-sm text-gray-600">Total XP</div>
            </div>
          </div>
        </div>

        {/* Creature Grid */}
        {creatures.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-lg border border-gray-200 text-center">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Your Forest is Empty</h3>
            <p className="text-gray-600 mb-6">Create your first creature companion to get started!</p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            >
              <Plus size={20} className="mr-2" />
              Create First Creature
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {creatures.map((creature) => (
              <CreatureCard
                key={creature.id}
                creature={creature}
                onSelect={() => selectCreature(creature.id)}
                isSelected={selectedCreatureId === creature.id}
              />
            ))}
          </div>
        )}

        {/* Selected Creature Details */}
        {selectedCreature && (
          <div className="mt-6 bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">
              {selectedCreature.name} Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Associated Tasks</h4>
                {selectedCreature.associatedTaskIds.length === 0 ? (
                  <p className="text-sm text-gray-500">No tasks assigned yet</p>
                ) : (
                  <div className="space-y-1">
                    {selectedCreature.associatedTaskIds.map((taskId) => {
                      const task = tasks.find(t => t.id === taskId);
                      return task ? (
                        <div key={taskId} className="text-sm bg-gray-50 p-2 rounded">
                          {task.title}
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Care Instructions</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Complete tasks to gain experience</p>
                  <p>• Focus sessions increase happiness</p>
                  <p>• Abandoned sessions cause injuries</p>
                  <p>• Feed with virtual currency</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <CreateCreatureModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <BottomNavigation currentPage="creature" />
    </div>
  );
};

export default Creature;
