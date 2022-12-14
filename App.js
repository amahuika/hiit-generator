import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import MyStack from "./components/navigation/MyStack";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <>
        <StatusBar style="light" />
        <MyStack />
      </>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({});
