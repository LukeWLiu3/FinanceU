import ChatBotCTA from "@/components/HomePage/askai";
import CoursePreview from "@/components/HomePage/courses";
import BudgetProgress from "@/components/HomePage/expenses";
import Header from "@/components/HomePage/header";
import MapCard from "@/components/HomePage/map";
import WelcomeCard from "@/components/HomePage/welcomecard";
import { ScrollView } from "react-native";
import ForumPreview from "@/components/HomePage/forum";
export default function HomeScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f0fdf4" }}>
      <Header />
      <WelcomeCard />
      <MapCard />
      <ForumPreview />
      <CoursePreview />
      <ChatBotCTA />
      <BudgetProgress />
    </ScrollView>
  );
}
