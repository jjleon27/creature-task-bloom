
import { Link } from "react-router-dom";

interface CreatureButtonProps {
  isActive: boolean;
}

export const CreatureButton = ({ isActive }: CreatureButtonProps) => {
  return (
    <Link 
      to="/creature"
      className={`relative flex flex-col items-center justify-center w-16 h-16 rounded-full transition-all duration-300 ${
        isActive 
          ? 'bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 text-white shadow-lg scale-110' 
          : 'bg-gradient-to-br from-emerald-200 via-green-300 to-teal-400 text-emerald-800 hover:scale-105'
      }`}
    >
      {/* Magical sparkles around the button */}
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
      
      {/* Main creature icon */}
      <div className="text-2xl animate-bounce">
        🦄
      </div>
      
      {/* Label */}
      <span className="text-xs font-medium mt-1">Forest</span>
      
      {/* Magical glow effect */}
      {isActive && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 opacity-20 animate-pulse"></div>
      )}
    </Link>
  );
};
