import { Text, View, StyleSheet, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Card from "../Card";
import RowSpaceBetween from "../RowSpaceBetween";
import { useState } from "react";

function DisplayList({ name, description, onDelete, onEdit, id }) {
  const [showDescription, setShowDescription] = useState(false);

  function onShowDetails() {
    showDescription ? setShowDescription(false) : setShowDescription(true);
  }

  return (
    <Card>
      <RowSpaceBetween style={styles.innerCardContainer}>
        <View>
          <Text style={{ fontSize: 16 }}>{name}</Text>
          {description !== null && (
            <Pressable onPress={onShowDetails}>
              <Text style={{ fontSize: 14 }}>
                Details{" "}
                {!showDescription ? (
                  <Ionicons name="chevron-down" size={18} color="black" />
                ) : (
                  <Ionicons name="chevron-up" size={18} color="black" />
                )}
              </Text>
            </Pressable>
          )}
        </View>
        <RowSpaceBetween>
          <Pressable onPress={() => onEdit(id)}>
            <Ionicons name="create-outline" size={34} color="#454de3" />
          </Pressable>
          <View style={{ width: 20 }} />
          <Pressable onPress={() => onDelete(id)}>
            <Ionicons name="trash-outline" size={34} color="#f31313" />
          </Pressable>
        </RowSpaceBetween>
      </RowSpaceBetween>
      {showDescription && <Text>{description}</Text>}
    </Card>
  );
}
export default DisplayList;

const styles = StyleSheet.create({
  cardContainer: {},
  innerCardContainer: {
    paddingBottom: 4,
    borderBottomColor: "#393E46",
    borderBottomWidth: 0.5,
    marginBottom: 4,
  },
});
