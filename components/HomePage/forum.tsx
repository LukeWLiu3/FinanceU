import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { forumTopics } from "@/constants/forum";

const ForumPreview = () => {
  const router = useRouter();

  return (
    <View className="px-4 mb-6">
      <View
        className="bg-white rounded-3xl p-5"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <View className="flex-row justify-between items-center mb-3">
          <View>
            <Text className="text-lg font-semibold text-gray-900">
              Community Forum
            </Text>
            <Text className="text-sm text-gray-500">
              Connect, ask questions, and learn together.
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push("/(tabs)/forum")}
            className="px-3 py-2 bg-green-100 rounded-full"
          >
            <Text className="text-green-700 font-semibold text-xs">
              Explore
            </Text>
          </Pressable>
        </View>

        <View className="mt-2">
          {forumTopics.slice(0, 3).map((topic) => (
            <Pressable
              key={topic.id}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/forum/[topic]",
                  params: { topic: topic.id },
                })
              }
              className="mb-3"
            >
              <View className="bg-green-50 rounded-2xl px-4 py-3">
                <Text className="text-base font-semibold text-green-800">
                  {topic.title}
                </Text>
                <Text className="text-sm text-green-900/70 mt-1">
                  {topic.blurb}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={() => router.push("/(tabs)/forum")}
          className="mt-2 self-start"
        >
          <Text className="text-green-600 font-semibold text-sm">
            Browse all topics →
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ForumPreview;
