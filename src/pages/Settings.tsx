
import { BottomNavigation } from "@/components/BottomNavigation";
import { RewardsButton } from "@/components/RewardsButton";
import { FriendsButton } from "@/components/FriendsButton";

const Settings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="relative">
        <RewardsButton />
        <FriendsButton />
      </div>
      
      <div className="p-6 pb-24">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
        <p className="text-gray-600 mb-8">Customize your app experience</p>
        
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Notifications</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span>Task reminders</span>
                <input type="checkbox" className="rounded" defaultChecked />
              </label>
              <label className="flex items-center justify-between">
                <span>Focus session alerts</span>
                <input type="checkbox" className="rounded" defaultChecked />
              </label>
              <label className="flex items-center justify-between">
                <span>Friend requests</span>
                <input type="checkbox" className="rounded" defaultChecked />
              </label>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Creature Settings</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span>Show creature animations</span>
                <input type="checkbox" className="rounded" defaultChecked />
              </label>
              <label className="flex items-center justify-between">
                <span>Creature sound effects</span>
                <input type="checkbox" className="rounded" />
              </label>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Focus Sessions</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span>Block other apps during focus</span>
                <input type="checkbox" className="rounded" defaultChecked />
              </label>
              <label className="flex items-center justify-between">
                <span>Show focus timer</span>
                <input type="checkbox" className="rounded" defaultChecked />
              </label>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation currentPage="settings" />
    </div>
  );
};

export default Settings;
