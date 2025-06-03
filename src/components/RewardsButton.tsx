
import { useState } from "react";
import { Gift } from "lucide-react";
import { useTaskStore } from "@/store/taskStore";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const RewardsButton = () => {
  const { virtualCurrency } = useTaskStore();
  const [isOpen, setIsOpen] = useState(false);

  const rewards = [
    { id: 1, name: "Coffee Voucher", cost: 100, description: "Get a free coffee!" },
    { id: 2, name: "Creature Hat", cost: 50, description: "Stylish hat for your creature" },
    { id: 3, name: "Creature Glasses", cost: 75, description: "Smart glasses for your creature" },
    { id: 4, name: "Premium Focus Music", cost: 150, description: "Unlock premium focus soundtracks" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="fixed top-6 left-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 z-50">
          <Gift size={24} />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
            {virtualCurrency}
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Reward Shop</DialogTitle>
          <p className="text-center text-gray-600">Currency: {virtualCurrency} coins</p>
        </DialogHeader>
        <div className="space-y-4">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div>
                <h3 className="font-medium">{reward.name}</h3>
                <p className="text-sm text-gray-600">{reward.description}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-yellow-600">{reward.cost} coins</p>
                <Button
                  size="sm"
                  disabled={virtualCurrency < reward.cost}
                  className="mt-1"
                >
                  Get
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
