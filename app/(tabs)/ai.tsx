import { MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Gemini from "gemini-ai";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Message {
  text: string;
  isUser: boolean;
}

export default function AskAIScreen() {
  const gemini = new Gemini("AIzaSyA8h3qu-Fg8NKB-3JTYNbxXw2IJMwFcCpo");

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const SYSTEM_PROMPT = `You are financialU, a financial assistant helping with personal finance, budgeting, and investment advice. Stay focused on financial topics only.`;

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      text: message,
      isUser: true,
    };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    // Scroll to bottom after sending message
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const fullPrompt = `${SYSTEM_PROMPT}\n\nUser question: ${message}`;
      const response = await gemini.ask(fullPrompt);

      const botMessage: Message = {
        text: response,
        isUser: false,
      };
      setMessages((prev) => [...prev, botMessage]);

      // Scroll to bottom after receiving response
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error("Error getting AI response:", error);
      Alert.alert("Error", "Failed to get response. Please try again.");
      const errorMessage: Message = {
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMessages([
      {
        text: "Hello! I'm financialU, your personal finance assistant. How can I help you with your financial goals today?",
        isUser: false,
      },
    ]);
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f8f9fa" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-white px-5 py-4 border-b border-gray-200">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 bg-green-500 rounded-full justify-center items-center">
              <FontAwesome6 name="robot" size={20} color="white" />
            </View>
            <View>
              <Text className="text-xl font-bold text-gray-800">
                financialU
              </Text>
              <Text className="text-sm text-gray-500">Financial Assistant</Text>
            </View>
          </View>
        </View>

        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            className="flex-1 px-4 py-4"
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() =>
              scrollViewRef.current?.scrollToEnd({ animated: true })
            }
          >
            {messages.map((msg, index) => (
              <View
                key={index}
                className={`flex-row my-2 ${
                  msg.isUser ? "self-end" : "self-start"
                } max-w-[85%]`}
              >
                {!msg.isUser && (
                  <View className="w-8 h-8 bg-red-500 rounded-full justify-center items-center mr-2">
                    <FontAwesome6 name="robot" size={14} color="white" />
                  </View>
                )}

                <View
                  className={`rounded-2xl p-4 ${
                    msg.isUser
                      ? "bg-red-500 rounded-tr-sm"
                      : "bg-white rounded-tl-sm"
                  }`}
                >
                  <Text
                    className={`text-base leading-6 ${
                      msg.isUser ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </Text>
                </View>

                {msg.isUser && (
                  <View className="w-8 h-8 bg-blue-500 rounded-full justify-center items-center ml-2">
                    <MaterialCommunityIcons
                      name="account"
                      size={14}
                      color="white"
                    />
                  </View>
                )}
              </View>
            ))}

            {isLoading && (
              <View className="flex-row items-center self-start my-2">
                <View className="w-8 h-8 bg-red-500 rounded-full justify-center items-center mr-2">
                  <FontAwesome6 name="robot" size={14} color="white" />
                </View>
                <View className="bg-white rounded-2xl rounded-tl-sm p-4">
                  <View className="flex-row items-center">
                    <ActivityIndicator size="small" color="#ef4444" />
                    <Text className="ml-2 text-gray-500">Thinking...</Text>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Input Area */}
          <View className="bg-white px-4 py-3 border-t border-gray-200 mb-16">
            <View className="flex-row items-end gap-2">
              <TextInput
                className="flex-1 border border-gray-300 rounded-full px-4 py-3 text-base bg-gray-50 max-h-32"
                value={message}
                onChangeText={setMessage}
                placeholder="Ask about budgeting, investing, saving..."
                multiline
                textAlignVertical="top"
                onSubmitEditing={handleSend}
                returnKeyType="send"
                blurOnSubmit={false}
              />
              <TouchableOpacity
                onPress={handleSend}
                disabled={isLoading || !message.trim()}
                className={`w-11 h-11 rounded-full justify-center items-center ${
                  message.trim() && !isLoading ? "bg-red-500" : "bg-gray-300"
                }`}
              >
                <MaterialCommunityIcons name="send" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
