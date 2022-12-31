import { View, Text, StyleSheet, TextInput } from "react-native";
import MyButton from "./MyButton";
import RowSpaceBetween from "./RowSpaceBetween";
import Modal from "react-native-modal";
import { useState } from "react";

function CategoryModal({ isOpen, toggleModal, onAdd, catForEdit }) {
  const [input, setInput] = useState();
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [focusStyle, setFocusStyle] = useState({
    borderColor: "#00ADB5",
    borderBottomWidth: 2,
  });

  function closeModal() {
    setInput();
    setIsFocused(false);
    setIsValid(true);
  }

  function onAddCategory() {
    if (input === undefined || input === "") {
      setIsValid(false);
    } else {
      closeModal();
      onAdd(input);
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
        onBackdropPress={() => {
          closeModal();
          toggleModal("close");
        }}
      >
        <View style={styles.innerModalContainer}>
          <View style={styles.inputContainer}>
            <Text style={{ fontSize: 20 }}>
              {catForEdit !== null ? "Edit" : "Add new"} Category
            </Text>
            <TextInput
              value={input}
              style={[styles.input, isFocused && focusStyle]}
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
    color: "#252424",
    borderBottomWidth: 0.5,
  },
  btnWidth: {
    width: "45%",
  },
});
