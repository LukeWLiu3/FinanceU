import { forumTopics } from "@/constants/forum";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

const ForumLanding = () => {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-[#f0fdf4]">
      <View className="px-5 pt-10 pb-28">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900">
            Community Forum
          </Text>
          <Text className="text-base text-gray-600 mt-2">
            Dive into topic-specific threads, share your wins, and get help from
            fellow FinanceU learners.
          </Text>
        </View>

        {forumTopics.map((topic) => (
          <Pressable
            key={topic.id}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/forum/[topic]",
                params: { topic: topic.id },
              })
            }
            className="mb-4"
          >
            <View
              className="bg-white rounded-3xl p-5 border border-green-100"
              style={{
                shadowColor: "#16a34a",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.05,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              <Text className="text-lg font-semibold text-green-800">
                {topic.title}
              </Text>
              <Text className="text-sm text-gray-600 mt-2">
                {topic.description}
              </Text>

              <View className="flex-row flex-wrap mt-3">
                {topic.highlights.map((highlight) => (
                  <View
                    key={highlight}
                    className="bg-green-100 rounded-full px-3 py-1 mr-2 mt-2"
                  >
                    <Text className="text-xs font-semibold text-green-700">
                      {highlight}
                    </Text>
                  </View>
                ))}
              </View>

              <Text className="text-xs text-gray-400 mt-4">
                Tap to view threads
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
};

export default ForumLanding;
