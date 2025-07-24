import { useAuthStore } from '@/utils/useAuth';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
const profile = () => {

  const {logOut} = useAuthStore();

  return (
    <View className="flex-1 items-center justify-center">
        <Text>Profile Page</Text>
        <Pressable className="bg-red-400" onPress={logOut}>
            <Text>Logout</Text>
        </Pressable>
    </View>
  )
}

export default profile