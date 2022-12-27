import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ToastProvider } from "react-native-toast-notifications";

import MyStack from "./components/navigation/MyStack";

export default function App() {
  global.__reanimatedWorkletInit = () => {};
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ToastProvider textStyle={{ color: "#EEEEEE" }}>
        <StatusBar style="light" />
        <MyStack />
      </ToastProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({});
