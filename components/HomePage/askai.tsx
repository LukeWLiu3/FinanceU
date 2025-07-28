import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

const ChatBotCTA = () => {
  return (
    <View className="px-6 mt-6">
      <Text className="text-xl font-bold mb-2">Ask Our AI Powered Finance Bot</Text>
      <Pressable
        onPress={() => router.push("/ai")}
        className="bg-green-500 rounded-xl px-6 py-4"
      >
        <Text className="text-white text-center font-semibold">Chat with the Bot</Text>
      </Pressable>
    </View>
  );
};

export default ChatBotCTA;