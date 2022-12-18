import { StyleSheet, View } from "react-native";

function Card({ children, style }) {
  return <View style={[styles.cardContainer, style]}>{children}</View>;
}
export default Card;

const styles = StyleSheet.create({
  cardContainer: {
    padding: 8,
    backgroundColor: "#EEEEEE",
    borderRadius: 4,
    marginVertical: 8,
    elevation: 4,
  },
});
