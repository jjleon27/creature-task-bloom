
import { BottomNavigation } from "@/components/BottomNavigation";
import { FriendsButton } from "@/components/FriendsButton";
import { RewardsButton } from "@/components/RewardsButton";
import { useTaskStore } from "@/store/taskStore";
import { Progress } from "@/components/ui/progress";

const Creature = () => {
  const { creatureHealth, creatureLevel, virtualCurrency, tasks } = useTaskStore();
  
  const completedTasks = tasks.filter(task => task.isCompleted).length;
  const totalTasks = tasks.length;
  const experiencePoints = completedTasks * 100;
  const nextLevelExp = creatureLevel * 500;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="relative">
        <RewardsButton />
        <FriendsButton />
      </div>
      
      <div className="p-6 pb-24">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Creature</h1>
        <p className="text-gray-600 mb-8">Watch your companion grow as you complete tasks!</p>
        
        {/* Creature Display */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 mb-6 text-center">
          <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center">
            <span className="text-6xl">🐾</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Level {creatureLevel} Companion</h2>
          <p className="text-gray-600 mb-4">A loyal productivity partner</p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-red-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-600">{creatureHealth}%</div>
              <div className="text-sm text-gray-600">Health</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-600">{virtualCurrency}</div>
              <div className="text-sm text-gray-600">Coins</div>
            </div>
          </div>
        </div>

        {/* Health Bar */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Health</span>
            <span className="text-sm text-gray-600">{creatureHealth}/100</span>
          </div>
          <Progress value={creatureHealth} className="h-3" />
          <p className="text-xs text-gray-500 mt-2">
            Complete tasks to improve health. Abandoning focus sessions will hurt your creature!
          </p>
        </div>

        {/* Experience */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Experience</span>
            <span className="text-sm text-gray-600">{experiencePoints}/{nextLevelExp} XP</span>
          </div>
          <Progress value={(experiencePoints / nextLevelExp) * 100} className="h-3" />
          <p className="text-xs text-gray-500 mt-2">
            Gain 100 XP for each completed task
          </p>
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{completedTasks}</div>
              <div className="text-sm text-gray-600">Tasks Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalTasks}</div>
              <div className="text-sm text-gray-600">Total Tasks</div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation currentPage="creature" />
    </div>
  );
};

export default Creature;
