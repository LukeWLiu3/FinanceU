import { useAuthStore } from "@/utils/useAuth";
import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";

const Header = () => {
  const { profile } = useAuthStore();

  return (
    <View>
      <View className="bg-white border-b border-red-200 pt-16 p-6">
        <Text className="text-lg font-bold">Home</Text>
        <Text className="text-gray-500">Welcome to FinanceU</Text>
      </View>
      <View className="bg-white flex justify-between flex-row w-full p-6 items-center">
        <View>
          <Text>FinanceU</Text>

          <View
            className="flex-1 bg-white items-center justify-center"
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Image
              className="flex-1 w-full bg-[#0553]"
              source={{ uri: "https://picsum.photos/seed/696/3000/2000" }}
              placeholder={{ blurhash: "YOUR_BLURHASH_HERE" }} // replace with actual blurhash
              contentFit="cover"
              transition={1000}
              style={{ flex: 1 }}
            />
          </View>
        </View>
        <View className="flex flex-row gap-3">
          <View>
            <Text>{profile?.full_name}</Text>
            <Text>Budget: {profile?.monthly_budget}</Text>
          </View>

          <View className="w-10 h-10 bg-green-500 rounded-full justify-center items-center">
            <Text>L</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Header;
