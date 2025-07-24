import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="bg-red-400">Hi example page</Text>
      <Pressable 
        className="flex items-center justify-center bg-blue-500 p-4 rounded-lg"
        onPress={() => router.push('/(auth)/login')}>

      </Pressable>
      <Pressable 
        className="flex items-center justify-center bg-red-500 p-4 rounded-lg"
        onPress={() => router.push('/(auth)/signup')}>

      </Pressable>
    </View>
  );
}

