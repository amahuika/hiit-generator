import SelectDropdown from "react-native-select-dropdown";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

function DropdownPickers({
  categories,
  exercises,
  onSelectCat,
  onSelectExercise,
}) {
  return (
    <View style={{ flexDirection: "row", backgroundColor: "#222831" }}>
      <SelectDropdown
        data={categories}
        onSelect={(item, index) => {
          onSelectCat(item.value);
        }}
        rowTextForSelection={(item, index) => item.label}
        buttonTextAfterSelection={(item, index) => item.label}
        buttonStyle={{ borderRadius: 4, flex: 1, marginBottom: 8 }}
        buttonTextStyle={{ fontSize: 16 }}
        rowTextStyle={{ fontSize: 16 }}
        dropdownStyle={{ borderRadius: 4 }}
        defaultButtonText="Select a category"
        renderDropdownIcon={() => (
          <Ionicons name="chevron-down" size={24} color="black" />
        )}
      />

      <View style={{ width: 8 }} />
      <SelectDropdown
        data={exercises}
        rowTextForSelection={(item, index) => item.name}
        disableAutoScroll={true}
        buttonStyle={{ borderRadius: 4, flex: 1 }}
        buttonTextStyle={{ fontSize: 16 }}
        rowTextStyle={{ fontSize: 16 }}
        dropdownStyle={{
          borderRadius: 4,
        }}
        renderDropdownIcon={() => (
          <Ionicons name="add-circle-outline" size={24} color="black" />
        )}
        defaultButtonText={"Add exercise"}
        buttonTextAfterSelection={() => "Add exercise"}
        onSelect={(item) => onSelectExercise(item)}
      />
    </View>
  );
}
export default DropdownPickers;
