import { useState } from "react";
import { View, Text, Button, StyleSheet, TextInput } from "react-native";
import Modal from "react-native-modal";

function SaveWorkoutModal({ toggle, showModal, saveHandler }) {
  const [nameInput, setNameInput] = useState();

  function modalCloseHandler() {
    toggle();
  }

  function onSave() {
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
            onChangeText={setNameInput}
            value={nameInput}
            placeholder="Your workout name"
          />

          <View style={styles.btn}>
            <Button title="Save" onPress={onSave} color={"#00ADB5"} />
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
