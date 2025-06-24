import Nav from "@/Components/Nav";
import { Link } from "expo-router";
import { Button, Text, TouchableOpacity, View } from "react-native";
import {createSession} from '../api/quizapi'
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";

export default function Index() {

  const router = useRouter();
  
  const startQuiz = async () => {
    try {
      const { sessionId } = await createSession();
      console.log("sessionId:", sessionId);
      if (sessionId) {
        router.push(`/quiz?sessionId=${sessionId}`);
      } else {
        console.error("Session creation failed");
      }
    } catch (error) {
      console.error("Failed to start quiz:", error);
    }
  };

  return (
      <View className="flex-1 justify-center items-center bg-slate-900">
        <View className="absolute top-0 left-0 mt-20 ml-20">
          <Nav />
        </View>
        <TouchableOpacity
          className="border bg-slate-500 text-black mx-2 px-20 py-2 rounded-md text-5xl hover:bg-slate-400" 
          onPress={startQuiz}>
          <Text className="text-white text-2xl">START</Text>
        </TouchableOpacity>
      </View>  
  );
}
