import { StyleSheet, View } from "react-native";

function Card({ children }) {
  return <View style={styles.cardContainer}>{children}</View>;
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
