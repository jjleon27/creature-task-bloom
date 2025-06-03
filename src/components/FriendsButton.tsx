
import { Users } from "lucide-react";
import { Link } from "react-router-dom";

export const FriendsButton = () => {
  return (
    <Link
      to="/friends"
      className="fixed top-6 right-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 z-50"
    >
      <Users size={24} />
    </Link>
  );
};
