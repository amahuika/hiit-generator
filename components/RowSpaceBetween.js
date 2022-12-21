import { StyleSheet, View } from "react-native";

function RowSpaceBetween({ children, style }) {
  return <View style={[styles.container, style]}>{children}</View>;
}
export default RowSpaceBetween;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
