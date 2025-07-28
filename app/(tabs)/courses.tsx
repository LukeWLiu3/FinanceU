import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

interface Course {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  url: string;
}

const coursesData: Course[] = [
  {
    id: "1",
    title: "Personal Finance Basics",
    duration: "varies",
    thumbnail: "https://img.youtube.com/vi/GtaoP0skPWc/maxresdefault.jpg",
    url: "https://www.youtube.com/embed/GtaoP0skPWc?autoplay=1&rel=0&modestbranding=1",
  },
  {
    id: "2",
    title: "How to Pay Off Debt in 2025",
    duration: "20-25 min",
    thumbnail: "https://img.youtube.com/vi/t4zfiBw0hwM/maxresdefault.jpg",
    url: "https://www.youtube.com/embed/t4zfiBw0hwM?autoplay=1&rel=0&modestbranding=1",
  },
  {
    id: "3",
    title: "Pay Off Debt Fast (8 Ways)",
    duration: "15 min",
    thumbnail: "https://img.youtube.com/vi/ks33lMoxst0/maxresdefault.jpg",
    url: "https://www.youtube.com/embed/ks33lMoxst0?autoplay=1&rel=0&modestbranding=1",
  },
  {
    id: "4",
    title: "Best Way Out of Credit Card Debt",
    duration: "15 min",
    thumbnail: "https://img.youtube.com/vi/4LSktB7Pk_c/maxresdefault.jpg",
    url: "https://www.youtube.com/embed/4LSktB7Pk_c?autoplay=1&rel=0&modestbranding=1",
  },
  {
    id: "5",
    title: "Emergency Fund or Pay Off Debt?",
    duration: "18 min",
    thumbnail: "https://img.youtube.com/vi/3SgVUlEcOBU/maxresdefault.jpg",
    url: "https://www.youtube.com/embed/3SgVUlEcOBU?autoplay=1&rel=0&modestbranding=1",
  },
  {
    id: "6",
    title: "Pay Debt or Build Emergency Fund?",
    duration: "10-12 min",
    thumbnail: "https://img.youtube.com/vi/6WCfVjUTTEY/maxresdefault.jpg",
    url: "https://www.youtube.com/embed/6WCfVjUTTEY?autoplay=1&rel=0&modestbranding=1",
  },
  {
    id: "7",
    title: "How to Build An Emergency Fund",
    duration: "12 min",
    thumbnail: "https://img.youtube.com/vi/mxsYHiDVNlk/maxresdefault.jpg",
    url: "https://www.youtube.com/embed/mxsYHiDVNlk?autoplay=1&rel=0&modestbranding=1",
  },
  {
    id: "8",
    title: "How Much Emergency Fund Do You Need?",
    duration: "13 min",
    thumbnail: "https://img.youtube.com/vi/U2Nw5T44zvY/maxresdefault.jpg",
    url: "https://www.youtube.com/embed/U2Nw5T44zvY?autoplay=1&rel=0&modestbranding=1",
  },
  {
    id: "9",
    title: "How to Pay Off Debt With Low Income",
    duration: "14 min",
    thumbnail: "https://img.youtube.com/vi/7rrSuhFC7I0/maxresdefault.jpg",
    url: "https://www.youtube.com/embed/7rrSuhFC7I0?autoplay=1&rel=0&modestbranding=1",
  },
  {
    id: "10",
    title: "How to Pay Off Debt While Saving Money",
    duration: "15 min",
    thumbnail: "https://img.youtube.com/vi/YL10H_EcB-E/maxresdefault.jpg",
    url: "https://www.youtube.com/embed/YL10H_EcB-E?autoplay=1&rel=0&modestbranding=1",
  },
  {
    id: "11",
    title: "How to Pay Off Debt With a Budget",
    duration: "16 min",
    thumbnail: "https://img.youtube.com/vi/QA2TBiIsdT0/maxresdefault.jpg",
    url: "https://www.youtube.com/embed/QA2TBiIsdT0?autoplay=1&rel=0&modestbranding=1",
  },
  {
    id: "12",
    title: "How to Pay Off Debt With Multiple Credit Cards",
    duration: "17 min",
    thumbnail: "https://img.youtube.com/vi/mtL_plJXv3c/maxresdefault.jpg",
    url: "https://www.youtube.com/embed/mtL_plJXv3c?autoplay=1&rel=0&modestbranding=1",
  },
  {
    id: "13",
    title: "How to Pay Off Debt With Student Loans",
    duration: "18 min",
    thumbnail: "https://img.youtube.com/vi/8IR5LefXVPY/maxresdefault.jpg",
    url: "https://www.youtube.com/embed/8IR5LefXVPY?autoplay=1&rel=0&modestbranding=1",
  },
];

const Courses = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCoursePress = (course: Course) => {
    setLoading(true);
    setSelectedCourse(course);
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
    setLoading(false);
  };

  const renderCourseItem = ({
    item,
    index,
  }: {
    item: Course;
    index: number;
  }) => (
    <Pressable
      onPress={() => handleCoursePress(item)}
      style={({ pressed }) => ({
        opacity: pressed ? 0.9 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      <View
        style={{
          marginHorizontal: 20,
          marginBottom: 24,
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          overflow: "hidden",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        {/* Thumbnail Container */}
        <View style={{ position: "relative" }}>
          <Image
            source={{ uri: item.thumbnail }}
            style={{
              width: "100%",
              height: 200,
              backgroundColor: "#F5F5F5",
            }}
            resizeMode="cover"
          />

          {/* Gradient Overlay */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.15)",
            }}
          />

          {/* Play Button */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: "rgba(255,255,255,0.95)",
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <MaterialIcons name="play-arrow" size={32} color="#1F2937" />
            </View>
          </View>

          {/* Duration Badge */}
          <View
            style={{
              position: "absolute",
              bottom: 12,
              right: 12,
              backgroundColor: "rgba(0,0,0,0.8)",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 6,
            }}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "600" }}>
              {item.duration}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View style={{ padding: 20 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#111827",
              lineHeight: 24,
              marginBottom: 8,
            }}
            numberOfLines={2}
          >
            {item.title}
          </Text>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons
              name="play-circle-outline"
              size={16}
              color="#6B7280"
            />
            <Text
              style={{
                fontSize: 14,
                color: "#6B7280",
                fontWeight: "500",
                marginLeft: 6,
              }}
            >
              Watch now
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#F9FAFB" }}
        edges={["top"]}
      >
        {/* Header */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            paddingHorizontal: 20,
            paddingVertical: 20,
            borderBottomWidth: 1,
            borderBottomColor: "#E5E7EB",
          }}
        >
          <Text
            style={{
              fontSize: 32,
              fontWeight: "800",
              color: "#111827",
              marginBottom: 4,
            }}
          >
            Learn
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#6B7280",
              fontWeight: "500",
            }}
          >
            {coursesData.length} courses • Financial education
          </Text>
        </View>

        {/* Course List */}
        <FlatList
          data={coursesData}
          renderItem={renderCourseItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 24,
            paddingBottom: Platform.OS === "ios" ? 100 : 80,
          }}
          ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
        />

        {/* Video Modal */}
        <Modal
          visible={!!selectedCourse}
          animationType="slide"
          presentationStyle={
            Platform.OS === "ios" ? "fullScreen" : "fullScreen"
          }
          onRequestClose={handleCloseModal}
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }}>
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 20,
                paddingVertical: 16,
                backgroundColor: "#000000",
              }}
            >
              <View style={{ flex: 1, marginRight: 16 }}>
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 18,
                    fontWeight: "700",
                    lineHeight: 22,
                  }}
                  numberOfLines={2}
                >
                  {selectedCourse?.title}
                </Text>
              </View>

              <Pressable
                onPress={handleCloseModal}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                  padding: 8,
                  borderRadius: 20,
                  backgroundColor: "rgba(255,255,255,0.1)",
                })}
              >
                <AntDesign name="close" size={20} color="#FFFFFF" />
              </Pressable>
            </View>

            {/* Video Player */}
            <View style={{ flex: 1, backgroundColor: "#000000" }}>
              {loading && (
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#000000",
                    zIndex: 1,
                  }}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: "rgba(255,255,255,0.1)",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 16,
                    }}
                  >
                    <MaterialIcons
                      name="play-arrow"
                      size={24}
                      color="#FFFFFF"
                    />
                  </View>
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 16,
                      fontWeight: "500",
                    }}
                  >
                    Loading video...
                  </Text>
                </View>
              )}

              <WebView
                source={{ uri: selectedCourse?.url || "" }}
                style={{ flex: 1, backgroundColor: "#000000" }}
                allowsFullscreenVideo={true}
                allowsInlineMediaPlayback={true}
                mediaPlaybackRequiresUserAction={false}
                onLoadEnd={() => setLoading(false)}
                onError={() => {
                  setLoading(false);
                  Alert.alert(
                    "Error",
                    "Unable to load video. Please check your internet connection.",
                    [{ text: "OK", onPress: handleCloseModal }]
                  );
                }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={false}
              />
            </View>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Courses;
