import { StyleSheet, View } from "react-native";

function CenteredView({ children, style }) {
  return <View style={[styles.container, style]}>{children}</View>;
}
export default CenteredView;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
