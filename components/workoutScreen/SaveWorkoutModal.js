import { useState } from "react";
import { View, Text, Button, StyleSheet, TextInput } from "react-native";
import Modal from "react-native-modal";
import MyButton from "../MyButton";

function SaveWorkoutModal({ toggle, showModal, saveHandler }) {
  const [nameInput, setNameInput] = useState("");
  const [isValid, setIsValid] = useState(true);

  function modalCloseHandler() {
    toggle();
  }

  function onSave() {
    if (nameInput === "") {
      setIsValid(false);
      return;
    }
    saveHandler(nameInput);

    setNameInput("");
  }

  return (
    <View>
      <Modal isVisible={showModal} onBackdropPress={modalCloseHandler}>
        <View style={styles.innerModalView}>
          <View style={{ alignItems: "flex-end" }}>
            <Text>X</Text>
          </View>
          <Text>Name your workout</Text>
          <TextInput
            style={styles.input}
            onChangeText={(txt) => {
              setIsValid(true);
              setNameInput(txt);
            }}
            value={nameInput}
            placeholder="Your workout name"
          />
          {!isValid && (
            <Text style={{ color: "#f35858" }}>
              * Please enter a valid name
            </Text>
          )}
          <View style={styles.btn}>
            <MyButton
              text={"Save"}
              onPress={onSave}
              style={{ backgroundColor: "#00ADB5" }}
              txtStyle={{ color: "#EEEEEE", fontSize: 20 }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
export default SaveWorkoutModal;

const styles = StyleSheet.create({
  innerModalView: {
    backgroundColor: "#EEEEEE",
    padding: 8,
    borderRadius: 8,
  },
  input: {
    borderColor: "#393E46",
    borderWidth: 0.5,
    borderRadius: 4,
    padding: 8,
    backgroundColor: "#ffffff",
    marginTop: 4,
    elevation: 3,
    fontSize: 20,
  },
  btn: {
    width: "100%",

    marginTop: 16,
  },
});
