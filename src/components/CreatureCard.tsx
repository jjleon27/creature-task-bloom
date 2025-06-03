
import { useState } from "react";
import { Creature } from "@/store/creatureStore";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Heart, Zap, Star, Bandage } from "lucide-react";

interface CreatureCardProps {
  creature: Creature;
  onSelect?: () => void;
  isSelected?: boolean;
}

export const CreatureCard = ({ creature, onSelect, isSelected }: CreatureCardProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [showReaction, setShowReaction] = useState(false);

  const getEvolutionEmoji = () => {
    const baseEmoji = creature.appearance.emoji;
    switch (creature.evolutionStage) {
      case 'baby': return baseEmoji;
      case 'child': return `✨${baseEmoji}`;
      case 'teen': return `⚡${baseEmoji}`;
      case 'adult': return `👑${baseEmoji}`;
      case 'elder': return `🌟${baseEmoji}`;
      default: return baseEmoji;
    }
  };

  const getHealthStatus = () => {
    if (creature.health >= 80) return { color: 'text-green-600', status: 'Healthy' };
    if (creature.health >= 60) return { color: 'text-yellow-600', status: 'Okay' };
    if (creature.health >= 40) return { color: 'text-orange-600', status: 'Tired' };
    return { color: 'text-red-600', status: 'Injured' };
  };

  const getHappinessEmoji = () => {
    if (creature.happiness >= 80) return '😄';
    if (creature.happiness >= 60) return '😊';
    if (creature.happiness >= 40) return '😐';
    if (creature.happiness >= 20) return '😔';
    return '😢';
  };

  const getReactionEmoji = () => {
    const reactions = ['💖', '✨', '🎉', '🌟', '💫'];
    return reactions[Math.floor(Math.random() * reactions.length)];
  };

  const handleCreaturePress = () => {
    setIsPressed(true);
    setShowReaction(true);
    setTimeout(() => {
      setIsPressed(false);
      setShowReaction(false);
    }, 1000);
  };

  const healthStatus = getHealthStatus();
  const experienceToNext = (creature.level * 100) - creature.experience;

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
      } ${isPressed ? 'scale-95' : ''}`}
      onClick={onSelect}
      style={{ backgroundColor: `${creature.appearance.baseColor}10` }}
    >
      <CardContent className="p-4">
        {/* Creature Visual */}
        <div className="text-center mb-4 relative">
          <div 
            className={`text-6xl mb-2 relative cursor-pointer transition-transform ${
              isPressed ? 'animate-bounce' : 'hover:scale-110'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              handleCreaturePress();
            }}
          >
            {getEvolutionEmoji()}
            <span className="absolute -top-1 -right-1 text-lg animate-pulse">
              {getHappinessEmoji()}
            </span>
            
            {/* Reaction overlay */}
            {showReaction && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl animate-ping">
                  {getReactionEmoji()}
                </span>
              </div>
            )}
          </div>
          
          <h3 className="font-semibold text-gray-800">{creature.name}</h3>
          <Badge variant="secondary" className="text-xs">
            Level {creature.level} {creature.evolutionStage}
          </Badge>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          {/* Health */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <Heart size={14} className={healthStatus.color} />
                <span className="text-xs font-medium">Health</span>
              </div>
              <span className={`text-xs ${healthStatus.color}`}>
                {healthStatus.status}
              </span>
            </div>
            <Progress value={creature.health} className="h-2" />
          </div>

          {/* Experience */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <Star size={14} className="text-yellow-600" />
                <span className="text-xs font-medium">Experience</span>
              </div>
              <span className="text-xs text-gray-600">
                {experienceToNext} to next level
              </span>
            </div>
            <Progress value={(creature.experience / (creature.level * 100)) * 100} className="h-2" />
          </div>

          {/* Happiness */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <Zap size={14} className="text-purple-600" />
                <span className="text-xs font-medium">Happiness</span>
              </div>
              <span className="text-xs text-gray-600">{creature.happiness}%</span>
            </div>
            <Progress value={creature.happiness} className="h-2" />
          </div>
        </div>

        {/* Injuries */}
        {creature.injuries.length > 0 && (
          <div className="mt-3 p-2 bg-red-50 rounded-lg animate-pulse">
            <div className="flex items-center gap-1 mb-1">
              <Bandage size={12} className="text-red-600" />
              <span className="text-xs font-medium text-red-700">Injuries</span>
            </div>
            <div className="text-xs text-red-600">
              {creature.injuries.join(', ')}
            </div>
          </div>
        )}

        {/* Traits */}
        <div className="mt-3 flex flex-wrap gap-1">
          {creature.appearance.traits.map((trait, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {trait}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
