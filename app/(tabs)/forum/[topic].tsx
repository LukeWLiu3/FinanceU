import { getTopicById } from "@/constants/forum";
import { supabase } from "@/utils/supabase";
import { useAuthStore } from "@/utils/useAuth";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

type ForumMessage = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  authorName: string;
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();

  const sameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (sameDay) {
    return date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const ForumTopicScreen = () => {
  const router = useRouter();
  const { topic } = useLocalSearchParams<{ topic?: string }>();
  const topicId = useMemo(() => (Array.isArray(topic) ? topic[0] : topic), [topic]);
  const topicDetails = useMemo(
    () => (topicId ? getTopicById(topicId) : undefined),
    [topicId],
  );
  const { user, profile } = useAuthStore();

  const [messages, setMessages] = useState<ForumMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchMessages = useCallback(
    async (showLoading = true) => {
      if (!topicId) return;

      if (showLoading) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      type RawMessage = {
        id: string;
        content: string;
        created_at: string;
        user_id: string;
        Profiles?: { full_name?: string | null } | null;
      };

      const { data, error } = await supabase
        .from("forum_messages")
        .select("id, content, created_at, user_id, Profiles(full_name)")
        .eq("topic", topicId)
        .order("created_at", { ascending: true })
        .returns<RawMessage[]>();

      if (error) {
        console.error("Forum fetch error:", error);
        Alert.alert(
          "Unable to load messages",
          "Please try again in a moment.",
        );
      } else if (data) {
        const parsed = data.map((item) => ({
          id: item.id,
          content: item.content,
          created_at: item.created_at,
          user_id: item.user_id,
          authorName:
            item.Profiles?.full_name ||
            (item.user_id === user?.id
              ? profile?.full_name || "You"
              : "Community Member"),
        }));

        setMessages(parsed);
      }

      setLoading(false);
      setRefreshing(false);
    },
    [profile?.full_name, topicId, user?.id],
  );

  useEffect(() => {
    if (!topicId) return;

    if (!topicDetails) {
      router.replace("/(tabs)/forum");
      return;
    }

    fetchMessages();
  }, [fetchMessages, topicDetails, topicId, router]);

  const handleSend = useCallback(async () => {
    if (!topicId) return;
    if (!input.trim()) return;

    if (!user?.id) {
      Alert.alert(
        "You need to be signed in",
        "Log in to participate in the discussion.",
      );
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase.from("forum_messages").insert({
        topic: topicId,
        content: input.trim(),
        user_id: user.id,
      });

      if (error) {
        console.error("Forum post error:", error);
        Alert.alert(
          "Message not sent",
          "We couldn't post your message. Please try again.",
        );
      } else {
        setInput("");
        await fetchMessages(false);
      }
    } finally {
      setSubmitting(false);
    }
  }, [fetchMessages, input, topicId, user?.id]);

  const renderMessage = useCallback(
    ({ item }: { item: ForumMessage }) => {
      const isAuthor = item.user_id === user?.id;

      return (
        <View
          className={`mb-3 rounded-3xl px-4 py-3 ${
            isAuthor ? "bg-green-600 self-end" : "bg-white border border-green-100"
          }`}
          style={{
            maxWidth: "88%",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isAuthor ? 0.2 : 0.08,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <Text
            className={`text-xs font-semibold ${
              isAuthor ? "text-white/90" : "text-green-700"
            } mb-1`}
          >
            {isAuthor ? "You" : item.authorName}
          </Text>
          <Text
            className={`text-base ${
              isAuthor ? "text-white" : "text-gray-700"
            }`}
          >
            {item.content}
          </Text>
          <Text
            className={`text-[11px] mt-2 ${
              isAuthor ? "text-white/70" : "text-gray-400"
            }`}
          >
            {formatTimestamp(item.created_at)}
          </Text>
        </View>
      );
    },
    [user?.id],
  );

  if (!topicDetails) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#f0fdf4]"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <View className="flex-1">
        <View className="px-5 pt-12 pb-4 bg-[#f0fdf4]">
          <Pressable
            onPress={() => router.back()}
            className="mb-4 self-start px-4 py-2 rounded-full bg-white border border-green-100"
          >
            <Text className="text-sm font-semibold text-green-700">Back</Text>
          </Pressable>
          <Text className="text-2xl font-bold text-gray-900">
            {topicDetails.title}
          </Text>
          <Text className="text-sm text-gray-600 mt-2">
            {topicDetails.blurb}
          </Text>
        </View>

        <View className="flex-1 px-3">
          {loading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#16a34a" />
            </View>
          ) : (
            <FlatList
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderMessage}
              contentContainerStyle={{
                paddingHorizontal: 8,
                paddingTop: 8,
                paddingBottom: 32,
              }}
              ListEmptyComponent={() => (
                <View className="mt-10 items-center">
                  <View className="bg-white rounded-3xl px-6 py-6 border border-dashed border-green-200">
                    <Text className="text-lg font-semibold text-green-700 text-center">
                      No messages yet
                    </Text>
                    <Text className="text-sm text-gray-500 text-center mt-2">
                      Be the first to start the conversation!
                    </Text>
                    <View className="flex-row flex-wrap justify-center mt-3">
                      {topicDetails.highlights.map((highlight) => (
                        <View
                          key={highlight}
                          className="px-3 py-1 bg-green-100 rounded-full mr-2 mt-2"
                        >
                          <Text className="text-xs font-semibold text-green-600">
                            {highlight}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              )}
              onRefresh={() => fetchMessages(false)}
              refreshing={refreshing}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>

      <View className="bg-white border-t border-green-100 px-4 py-4">
        <View className="bg-green-50 rounded-2xl px-4 py-3 border border-green-100">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Share your thoughts..."
            placeholderTextColor="#6b7280"
            multiline
            className="text-base text-gray-800"
          />
        </View>

        <Pressable
          onPress={handleSend}
          disabled={submitting || !input.trim()}
          className={`mt-3 rounded-2xl py-3 items-center ${
            submitting || !input.trim() ? "bg-green-200" : "bg-green-600"
          }`}
        >
          <Text className="text-white font-semibold text-base">
            {submitting ? "Sending..." : "Send message"}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ForumTopicScreen;
