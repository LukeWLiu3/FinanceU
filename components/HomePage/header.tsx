import { Text, View } from "react-native";

const Header = () => (
  <View className="pt-14 px-6 bg-white">
    <Text className="text-2xl font-bold text-gray-800">Home</Text>
    <Text className="text-green-600 text-xl font-extrabold tracking-wide">
      FINANCE <Text className="text-black">U</Text>
    </Text>
  </View>
);

export default Header;
