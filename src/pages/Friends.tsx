
import { BottomNavigation } from "@/components/BottomNavigation";
import { RewardsButton } from "@/components/RewardsButton";
import { Users } from "lucide-react";

const Friends = () => {
  const mockFriends = [
    { id: 1, name: "Alex Chen", creature: "🦊", level: 3, status: "online" },
    { id: 2, name: "Sarah Johnson", creature: "🐱", level: 5, status: "focusing" },
    { id: 3, name: "Mike Rodriguez", creature: "🐸", level: 2, status: "offline" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="relative">
        <RewardsButton />
      </div>
      
      <div className="p-6 pb-24">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Friends</h1>
        <p className="text-gray-600 mb-8">Connect with friends and focus together!</p>
        
        {mockFriends.length === 0 ? (
          <div className="text-center py-12">
            <Users size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No friends yet</h3>
            <p className="text-gray-500">Add friends to share tasks and focus together!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {mockFriends.map((friend) => (
              <div
                key={friend.id}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{friend.creature}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{friend.name}</h3>
                    <p className="text-sm text-gray-600">Level {friend.level}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      friend.status === 'online'
                        ? 'bg-green-100 text-green-700'
                        : friend.status === 'focusing'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {friend.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation currentPage="friends" />
    </div>
  );
};

export default Friends;
