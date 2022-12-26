import { View, Text, StyleSheet, TextInput } from "react-native";
import MyButton from "./MyButton";
import RowSpaceBetween from "./RowSpaceBetween";
import Modal from "react-native-modal";
import { useState } from "react";

const focus = {
  backgroundColor: "#e6dddd",
  borderColor: "#00ADB5",
};

const blur = {
  backgroundColor: "#EEEEEE",
  borderColor: "black",
};

function CategoryModal({ isOpen, toggleModal, onAdd, catForEdit }) {
  const [input, setInput] = useState();
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(true);

  function closeModal() {
    setInput();
    setIsValid(true);
  }

  function onAddCategory() {
    if (input === undefined || input === "") {
      setIsValid(false);
    } else {
      onAdd(input);
      closeModal();
    }
  }

  function checkIfEdit() {
    if (catForEdit !== null) {
      setInput(catForEdit.name);
    }
  }
  return (
    <View>
      <Modal
        isVisible={isOpen}
        onModalShow={checkIfEdit}
        onBackdropPress={() => toggleModal("close")}
      >
        <View style={styles.innerModalContainer}>
          <View style={styles.inputContainer}>
            <Text style={{ fontSize: 20 }}>Add new Category</Text>
            <TextInput
              value={input}
              style={[styles.input, isFocused ? focus : blur]}
              onChangeText={(text) => {
                setIsValid(true);
                setInput(text);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            {!isValid && (
              <Text style={{ color: "#e36666" }}>
                *Please enter a valid category name
              </Text>
            )}
          </View>

          <RowSpaceBetween>
            <View style={[styles.btnWidth]}>
              <MyButton
                text={catForEdit !== null ? "Update" : "Add"}
                onPress={onAddCategory}
              />
            </View>
            <View style={[styles.btnWidth]}>
              <MyButton text={"Cancel"} onPress={() => closeModal()} />
            </View>
          </RowSpaceBetween>
        </View>
      </Modal>
    </View>
  );
}
export default CategoryModal;

const styles = StyleSheet.create({
  innerModalContainer: {
    backgroundColor: "#EEEEEE",
    padding: 8,
    borderRadius: 8,
  },
  inputContainer: {
    marginVertical: 4,
    marginBottom: 16,
  },
  input: {
    fontSize: 16,
    color: "#5a5b5e",
    borderBottomWidth: 0.5,
    borderRadius: 4,
    paddingStart: 4,
  },
  btnWidth: {
    width: "45%",
  },
});
