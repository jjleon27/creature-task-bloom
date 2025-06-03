
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Creature {
  id: string;
  name: string;
  category: string; // music, study, fitness, art, etc.
  level: number;
  health: number;
  experience: number;
  happiness: number;
  associatedTaskIds: string[];
  injuries: string[];
  evolutionStage: 'baby' | 'child' | 'teen' | 'adult' | 'elder';
  appearance: {
    baseColor: string;
    secondaryColor: string;
    emoji: string;
    traits: string[];
  };
  createdAt: string;
  lastFed: string;
}

interface CreatureStore {
  creatures: Creature[];
  selectedCreatureId: string | null;
  createCreature: (category: string, taskId?: string) => Creature;
  addTaskToCreature: (creatureId: string, taskId: string) => void;
  updateCreatureStats: (creatureId: string, updates: Partial<Pick<Creature, 'health' | 'experience' | 'happiness'>>) => void;
  addInjury: (creatureId: string, injury: string) => void;
  healCreature: (creatureId: string) => void;
  evolveCreature: (creatureId: string) => void;
  selectCreature: (creatureId: string) => void;
}

const generateCreatureAppearance = (category: string) => {
  const categoryMap: Record<string, { emoji: string; baseColor: string; secondaryColor: string; traits: string[] }> = {
    music: { emoji: '🎤', baseColor: '#9333ea', secondaryColor: '#c084fc', traits: ['Musical', 'Rhythmic', 'Harmonious'] },
    study: { emoji: '🦉', baseColor: '#2563eb', secondaryColor: '#60a5fa', traits: ['Wise', 'Focused', 'Analytical'] },
    fitness: { emoji: '🐯', baseColor: '#dc2626', secondaryColor: '#f87171', traits: ['Strong', 'Energetic', 'Healthy'] },
    art: { emoji: '🦋', baseColor: '#ea580c', secondaryColor: '#fb923c', traits: ['Creative', 'Colorful', 'Imaginative'] },
    cooking: { emoji: '🐻', baseColor: '#ca8a04', secondaryColor: '#facc15', traits: ['Tasty', 'Nurturing', 'Flavorful'] },
    reading: { emoji: '🐙', baseColor: '#059669', secondaryColor: '#34d399', traits: ['Literary', 'Thoughtful', 'Curious'] },
    gaming: { emoji: '🦊', baseColor: '#7c3aed', secondaryColor: '#a78bfa', traits: ['Playful', 'Strategic', 'Quick'] },
    language: { emoji: '🦜', baseColor: '#059669', secondaryColor: '#34d399', traits: ['Communicative', 'Expressive', 'Social'] },
    coding: { emoji: '🤖', baseColor: '#1f2937', secondaryColor: '#6b7280', traits: ['Logical', 'Precise', 'Innovative'] },
    garden: { emoji: '🐰', baseColor: '#16a34a', secondaryColor: '#4ade80', traits: ['Patient', 'Growing', 'Natural'] },
    default: { emoji: '🐾', baseColor: '#6b7280', secondaryColor: '#9ca3af', traits: ['Loyal', 'Friendly', 'Adaptable'] }
  };

  return categoryMap[category.toLowerCase()] || categoryMap.default;
};

export const useCreatureStore = create<CreatureStore>()(
  persist(
    (set, get) => ({
      creatures: [],
      selectedCreatureId: null,

      createCreature: (category, taskId) => {
        const appearance = generateCreatureAppearance(category);
        const newCreature: Creature = {
          id: Date.now().toString(),
          name: `${category.charAt(0).toUpperCase() + category.slice(1)} Buddy`,
          category,
          level: 1,
          health: 100,
          experience: 0,
          happiness: 80,
          associatedTaskIds: taskId ? [taskId] : [],
          injuries: [],
          evolutionStage: 'baby',
          appearance,
          createdAt: new Date().toISOString(),
          lastFed: new Date().toISOString(),
        };

        set((state) => ({
          creatures: [...state.creatures, newCreature],
          selectedCreatureId: newCreature.id,
        }));

        return newCreature;
      },

      addTaskToCreature: (creatureId, taskId) => {
        set((state) => ({
          creatures: state.creatures.map((creature) =>
            creature.id === creatureId
              ? { ...creature, associatedTaskIds: [...creature.associatedTaskIds, taskId] }
              : creature
          ),
        }));
      },

      updateCreatureStats: (creatureId, updates) => {
        set((state) => ({
          creatures: state.creatures.map((creature) => {
            if (creature.id === creatureId) {
              const updatedCreature = { ...creature, ...updates };
              
              // Check for evolution
              if (updatedCreature.experience >= updatedCreature.level * 100 && updatedCreature.level < 20) {
                const newLevel = updatedCreature.level + 1;
                let newStage = updatedCreature.evolutionStage;
                
                if (newLevel >= 15) newStage = 'elder';
                else if (newLevel >= 10) newStage = 'adult';
                else if (newLevel >= 6) newStage = 'teen';
                else if (newLevel >= 3) newStage = 'child';
                
                return {
                  ...updatedCreature,
                  level: newLevel,
                  evolutionStage: newStage,
                  experience: updatedCreature.experience - (updatedCreature.level * 100),
                };
              }
              
              return updatedCreature;
            }
            return creature;
          }),
        }));
      },

      addInjury: (creatureId, injury) => {
        set((state) => ({
          creatures: state.creatures.map((creature) =>
            creature.id === creatureId
              ? { 
                  ...creature, 
                  injuries: [...creature.injuries, injury],
                  health: Math.max(0, creature.health - 20),
                  happiness: Math.max(0, creature.happiness - 15),
                }
              : creature
          ),
        }));
      },

      healCreature: (creatureId) => {
        set((state) => ({
          creatures: state.creatures.map((creature) =>
            creature.id === creatureId
              ? { 
                  ...creature, 
                  injuries: [],
                  health: Math.min(100, creature.health + 30),
                  happiness: Math.min(100, creature.happiness + 20),
                }
              : creature
          ),
        }));
      },

      evolveCreature: (creatureId) => {
        // This would be called automatically in updateCreatureStats
      },

      selectCreature: (creatureId) => {
        set({ selectedCreatureId: creatureId });
      },
    }),
    {
      name: 'creature-store',
    }
  )
);
