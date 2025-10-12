<<<<<<< HEAD
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
=======
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";

import { fetchNearbyPlaces, NearbyPlace } from "@/utils/api/geoapify";

const MapCard = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [userCoords, setUserCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [searchArea, setSearchArea] = useState<{
    latitude: number;
    longitude: number;
    radiusMeters: number;
  } | null>(null);
  const [pendingArea, setPendingArea] = useState<{
    latitude: number;
    longitude: number;
    radiusMeters: number;
  } | null>(null);
  const [showSearchButton, setShowSearchButton] = useState(false);
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const [places, setPlaces] = useState<NearbyPlace[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadLocation = async () => {
      try {
        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          if (!isMounted) return;
          setPermissionError(
            "Location permission is required to find nearby deals.",
          );
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          maximumAge: 60_000,
        });

        if (!isMounted) return;

        setUserCoords({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        setCurrentRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        });
        setSearchArea({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          radiusMeters: 3000,
        });
      } catch (error) {
        console.error("Location error:", error);
        if (isMounted) {
          setPermissionError(
            "We couldn't determine your location. Try again later.",
          );
        }
      } finally {
        if (isMounted) {
          setLocationLoading(false);
        }
      }
    };

    loadLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadPlaces = async () => {
        if (!searchArea) return;

      setPlacesLoading(true);
      setFetchError(null);

      try {
        const nearbyPlaces = await fetchNearbyPlaces({
          latitude: searchArea.latitude,
          longitude: searchArea.longitude,
          radiusMeters: searchArea.radiusMeters,
        });
        if (!isMounted) return;
        setPlaces(nearbyPlaces);
      } catch (error) {
        console.error("Nearby place fetch error:", error);
        if (isMounted) {
          setFetchError(
            error instanceof Error
              ? error.message
              : "Unable to fetch locations right now.",
          );
        }
      } finally {
        if (isMounted) {
          setPlacesLoading(false);
        }
      }
    };

    loadPlaces();

    return () => {
      isMounted = false;
    };
  }, [searchArea]);

  const topPlaces = useMemo(() => places.slice(0, 3), [places]);

  const mapRegion = useMemo(() => {
    if (currentRegion) {
      return currentRegion;
    }

    if (userCoords) {
      return {
        latitude: userCoords.latitude,
        longitude: userCoords.longitude,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      };
    }

    return {
      latitude: 37.7749,
      longitude: -122.4194,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    };
  }, [userCoords]);

  const showCallToAction =
    !locationLoading &&
    !placesLoading &&
    !permissionError &&
    places.length === 0;

  const calculateRadius = useCallback((region: Region) => {
    const metersPerDegreeLat = 111_000;
    const latMeters = region.latitudeDelta * metersPerDegreeLat;
    const lonMeters =
      region.longitudeDelta *
      metersPerDegreeLat *
      Math.cos((region.latitude * Math.PI) / 180);
    const approx = Math.max(latMeters, lonMeters) / 2;
    return Math.max(1000, Math.min(8000, Math.round(approx)));
  }, []);

  const handleRegionChange = useCallback(
    (region: Region) => {
      setCurrentRegion(region);
      setPendingArea({
        latitude: region.latitude,
        longitude: region.longitude,
        radiusMeters: calculateRadius(region),
      });
      setShowSearchButton(true);
    },
    [calculateRadius],
  );

  const handleSearchThisArea = useCallback(() => {
    if (!pendingArea) return;
    setSearchArea(pendingArea);
    setShowSearchButton(false);
  }, [pendingArea]);

  return (
    <View className="px-6 mt-5">
      <View
        className="bg-white rounded-3xl p-5"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.08,
          shadowRadius: 10,
          elevation: 8,
        }}
      >
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-1 pr-4">
            <Text className="text-lg font-semibold text-gray-900">
              Nearby Deals & Discounts
            </Text>
            <Text className="text-sm text-gray-500">
              Find outlets, discount stores, and savings-friendly shops nearby.
            </Text>
          </View>
          <Pressable
            onPress={() => setModalVisible(true)}
            className="px-4 py-2 bg-green-600 rounded-full shrink-0"
            disabled={locationLoading || permissionError !== null}
          >
            <Text className="text-white font-semibold text-sm">Open Map</Text>
          </Pressable>
        </View>

        {locationLoading ? (
          <View className="py-6 items-center">
            <ActivityIndicator size="small" color="#16a34a" />
            <Text className="text-sm text-gray-500 mt-2">
              Determining your location…
            </Text>
          </View>
        ) : permissionError ? (
          <View className="bg-red-50 rounded-2xl px-4 py-4">
            <Text className="text-sm text-red-600 font-semibold">
              Enable Location Access
            </Text>
            <Text className="text-xs text-red-500 mt-1">
              {permissionError}
            </Text>
          </View>
        ) : placesLoading ? (
          <View className="py-6 items-center">
            <ActivityIndicator size="small" color="#16a34a" />
            <Text className="text-sm text-gray-500 mt-2">
              Searching for nearby offers…
            </Text>
          </View>
        ) : fetchError ? (
          <View className="bg-red-50 rounded-2xl px-4 py-4">
            <Text className="text-sm text-red-600 font-semibold">
              Unable to load locations
            </Text>
            <Text className="text-xs text-red-500 mt-1">{fetchError}</Text>
          </View>
        ) : showCallToAction ? (
          <View className="bg-green-50 rounded-2xl px-4 py-6 items-center">
            <Text className="text-sm text-green-700 font-semibold">
              No deals found in this view
            </Text>
            <Text className="text-xs text-green-600 mt-2 text-center">
              Expand your radius on the map to explore more offers.
            </Text>
          </View>
        ) : (
          <View>
            {searchArea ? (
              <Text className="text-xs text-gray-400 mb-3">
                Showing results within {(searchArea.radiusMeters / 1000).toFixed(1)} km of this area.
              </Text>
            ) : null}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mt-1"
            >
              {topPlaces.map((place) => (
                <View
                  key={place.id}
                  className="bg-green-50 rounded-2xl px-4 py-3 mr-3 w-56"
                >
                  <Text className="text-sm font-semibold text-green-800">
                    {place.name}
                  </Text>
                  {place.category ? (
                    <Text className="text-xs text-green-700 mt-1">
                      {place.category.replace(/_/g, " ")}
                    </Text>
                  ) : null}
                  <Text className="text-xs text-gray-500 mt-2">
                    {place.address}
                  </Text>
                  <Text className="text-[11px] text-green-700 mt-2">
                    {place.highlight
                      ? `Deal focus: ${place.highlight}`
                      : "Savings-friendly spot"}
                  </Text>
                  {place.distanceMeters ? (
                    <Text className="text-[11px] text-gray-400 mt-2">
                      {`${(place.distanceMeters / 1000).toFixed(1)} km away`}
                    </Text>
                  ) : null}
                </View>
              ))}
            </ScrollView>
            {places.length > 3 ? (
              <Text className="text-xs text-gray-400 mt-3">
                Showing top {topPlaces.length} of {places.length} locations nearby.
              </Text>
            ) : null}
          </View>
        )}
      </View>

      <Modal visible={modalVisible} animationType="slide">
        <View className="flex-1 bg-[#f0fdf4]">
          <MapView
            style={{ flex: 1 }}
            region={mapRegion}
            onRegionChangeComplete={handleRegionChange}
          >
            {userCoords ? (
              <Marker
                coordinate={userCoords}
                title="You"
                description="Your current location"
                pinColor="#16a34a"
              />
            ) : null}

            {places.map((place) => (
              <Marker
                key={place.id}
                coordinate={{ latitude: place.latitude, longitude: place.longitude }}
                title={place.name}
                description={place.address}
              />
            ))}
          </MapView>

          {showSearchButton ? (
            <View className="absolute top-12 left-0 right-0 items-center">
              <Pressable
                onPress={handleSearchThisArea}
                className="bg-green-600 px-5 py-3 rounded-full shadow-lg"
              >
                <Text className="text-white font-semibold">
                  Search this area
                </Text>
              </Pressable>
            </View>
          ) : null}

          <Pressable
            onPress={() => {
              setModalVisible(false);
              setShowSearchButton(false);
              setPendingArea(null);
            }}
            className="absolute top-12 right-6 bg-white rounded-full px-4 py-2 border border-green-100"
          >
            <Text className="text-sm font-semibold text-green-700">Close</Text>
          </Pressable>

          <View className="absolute bottom-0 w-full bg-white rounded-t-3xl px-5 py-6 border-t border-green-100">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              {places.length > 0
                ? "Budget-friendly spots near you"
                : "Zoom out or pan to discover more options"}
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 4 }}
            >
              {places.length === 0 ? (
                <View className="bg-green-50 rounded-2xl px-4 py-3 mr-3">
                  <Text className="text-sm text-green-700">
                    Try adjusting the map view to widen your search radius.
                  </Text>
                </View>
              ) : (
                places.map((place) => (
                  <View
                    key={`sheet-${place.id}`}
                    className="bg-green-50 rounded-2xl px-4 py-3 mr-3 w-60"
                  >
                    <Text className="text-base font-semibold text-green-900">
                      {place.name}
                    </Text>
                    <Text className="text-xs text-gray-500 mt-1">
                      {place.address}
                    </Text>
                    {place.category ? (
                      <Text className="text-xs text-green-700 mt-2">
                        {place.category.replace(/_/g, " ")}
                      </Text>
                    ) : null}
                    <Text className="text-[11px] text-green-700 mt-2">
                      {place.highlight
                        ? `Deal focus: ${place.highlight}`
                        : "Budget-friendly location"}
                    </Text>
                    {place.distanceMeters ? (
                      <Text className="text-[11px] text-gray-400 mt-2">
                        {`${(place.distanceMeters / 1000).toFixed(1)} km away`}
                      </Text>
                    ) : null}
                    {place.phone ? (
                      <Text className="text-xs text-gray-400 mt-2">
                        {place.phone}
                      </Text>
                    ) : null}
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
>>>>>>> feature/discount-map
      </Modal>
    </View>
  );
};

export default MapCard;
