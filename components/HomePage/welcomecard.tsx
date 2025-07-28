import { useAuthStore } from "@/utils/useAuth";
import { Text, View } from "react-native";

const WelcomeCard = () => {
  const { profile } = useAuthStore();
  const initial = profile?.full_name?.charAt(0)?.toUpperCase() || "?";

  return (
    <View className="bg-white px-6 py-4 flex-row justify-between items-center">
      <View>
        <Text className="text-lg font-semibold">Welcome, <Text className="text-green-600">{profile?.full_name || "User"}</Text></Text>
        <Text className="text-gray-500">Budget: ${profile?.monthly_budget || "0.00"}</Text>
      </View>
      <View className="w-10 h-10 bg-green-500 rounded-full justify-center items-center">
        <Text className="text-white text-lg font-bold">{initial}</Text>
      </View>
    </View>
  );
};

export default WelcomeCard;
