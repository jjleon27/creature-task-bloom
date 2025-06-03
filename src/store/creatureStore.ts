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
    animalType: string;
    description: string;
    accessories: string[];
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
  const categoryMap: Record<string, { 
    animalType: string; 
    baseColor: string; 
    secondaryColor: string; 
    description: string;
    accessories: string[];
    traits: string[] 
  }> = {
    music: { 
      animalType: 'Musical Bunny', 
      baseColor: '#9333ea', 
      secondaryColor: '#c084fc', 
      description: 'A cheerful bunny with oversized headphones and a microphone tail. Always humming melodies and tapping its feet to the rhythm.',
      accessories: ['🎧 Headphones', '🎤 Microphone tail', '🎵 Musical notes floating around'],
      traits: ['Rhythmic', 'Melodic', 'Harmonious', 'Energetic'] 
    },
    study: { 
      animalType: 'Wise Owl Scholar', 
      baseColor: '#2563eb', 
      secondaryColor: '#60a5fa', 
      description: 'A scholarly owl wearing thick glasses and a graduation cap. Has stacks of books under its wings and glowing eyes when focused.',
      accessories: ['👓 Thick glasses', '🎓 Graduation cap', '📚 Book collection'],
      traits: ['Intelligent', 'Focused', 'Analytical', 'Patient'] 
    },
    fitness: { 
      animalType: 'Buff Tiger', 
      baseColor: '#dc2626', 
      secondaryColor: '#f87171', 
      description: 'A muscular tiger with sweatbands and a determined expression. Always flexing and ready for action, with visible abs and strong paws.',
      accessories: ['💪 Sweatbands', '🏃‍♂️ Running shoes', '💧 Sweat drops'],
      traits: ['Strong', 'Energetic', 'Determined', 'Athletic'] 
    },
    art: { 
      animalType: 'Creative Chameleon', 
      baseColor: '#ea580c', 
      secondaryColor: '#fb923c', 
      description: 'A colorful chameleon with paint brushes for fingers and a palette-shaped tail. Changes colors based on mood and creativity level.',
      accessories: ['🎨 Paint palette tail', '🖌️ Brush fingers', '🌈 Color-changing skin'],
      traits: ['Creative', 'Colorful', 'Imaginative', 'Expressive'] 
    },
    cooking: { 
      animalType: 'Chef Bear', 
      baseColor: '#ca8a04', 
      secondaryColor: '#facc15', 
      description: 'A friendly bear wearing a chef hat and apron. Has wooden spoons for arms and always smells like fresh bread and spices.',
      accessories: ['👨‍🍳 Chef hat', '🥄 Wooden spoon arms', '👘 Kitchen apron'],
      traits: ['Nurturing', 'Flavorful', 'Warm', 'Generous'] 
    },
    reading: { 
      animalType: 'Literary Octopus', 
      baseColor: '#059669', 
      secondaryColor: '#34d399', 
      description: 'An intelligent octopus with each tentacle holding a different book. Wears reading glasses and has a cozy library den.',
      accessories: ['👓 Reading glasses', '📖 Eight different books', '🕯️ Reading lamp'],
      traits: ['Literary', 'Thoughtful', 'Curious', 'Multi-tasking'] 
    },
    gaming: { 
      animalType: 'Gamer Fox', 
      baseColor: '#7c3aed', 
      secondaryColor: '#a78bfa', 
      description: 'A sleek fox with LED-lit fur and gaming controller paws. Has glowing eyes and quick reflexes, always ready for the next challenge.',
      accessories: ['🎮 Controller paws', '💡 LED fur patterns', '👾 Gaming headset'],
      traits: ['Quick', 'Strategic', 'Competitive', 'Tech-savvy'] 
    },
    language: { 
      animalType: 'Polyglot Parrot', 
      baseColor: '#059669', 
      secondaryColor: '#34d399', 
      description: 'A vibrant parrot with speech bubbles containing different languages floating around it. Loves to chat and learn new words.',
      accessories: ['💬 Multi-language speech bubbles', '🗣️ Expressive beak', '🌍 World map wing patterns'],
      traits: ['Communicative', 'Social', 'Expressive', 'Multilingual'] 
    },
    coding: { 
      animalType: 'Cyber Raccoon', 
      baseColor: '#1f2937', 
      secondaryColor: '#6b7280', 
      description: 'A tech-savvy raccoon with binary code patterns on its fur and glowing circuit board tail. Wears VR goggles and types with lightning speed.',
      accessories: ['🥽 VR goggles', '💻 Circuit board tail', '⚡ Code-streaming fingers'],
      traits: ['Logical', 'Innovative', 'Precise', 'Night-owl'] 
    },
    garden: { 
      animalType: 'Garden Rabbit', 
      baseColor: '#16a34a', 
      secondaryColor: '#4ade80', 
      description: 'A gentle rabbit with flowers growing from its ears and a carrot-shaped tail. Always surrounded by butterflies and has dirt under its paws.',
      accessories: ['🌸 Flower ear decorations', '🥕 Carrot tail', '🦋 Butterfly friends'],
      traits: ['Patient', 'Growing', 'Natural', 'Peaceful'] 
    },
    default: { 
      animalType: 'Loyal Dog', 
      baseColor: '#6b7280', 
      secondaryColor: '#9ca3af', 
      description: 'A friendly golden retriever with a wagging tail and bright, eager eyes. Always ready to help and learn new tricks.',
      accessories: ['🐕 Wagging tail', '👁️ Bright eyes', '🦴 Favorite bone'],
      traits: ['Loyal', 'Friendly', 'Adaptable', 'Helpful'] 
    }
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
          name: `${appearance.animalType}`,
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
