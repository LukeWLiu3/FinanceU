import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

const MapCard = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View className="px-6 mt-4">
      <Pressable onPress={() => setModalVisible(true)}>
        <View className="h-36 bg-green-100 rounded-2xl justify-center items-center">
          <Text className="text-gray-600">Explore locations near you</Text>
        </View>
      </Pressable>

      <Modal visible={modalVisible} animationType="slide">
        <View className="flex-1">
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: 37.4275,
              longitude: -122.1697,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            <Marker coordinate={{ latitude: 37.4275, longitude: -122.1697 }} />
          </MapView>
          <View className="absolute bottom-0 w-full bg-white py-4 items-center">
            <Text className="text-lg font-semibold text-gray-800">
              Discount Locator Coming Soon
            </Text>
          </View>
          <Pressable
            onPress={() => setModalVisible(false)}
            className="absolute top-10 right-6 bg-gray-200 px-4 py-2 rounded-full"
          >
            <Text className="text-gray-800">Close</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

export default MapCard;
