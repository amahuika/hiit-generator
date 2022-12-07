import { View, Text, Button, StyleSheet } from "react-native";
import Modal from "react-native-modal";

function SaveWorkoutModal({ toggle, showModal }) {
  function modalCloseHandler() {
    toggle();
  }

  return (
    <View>
      <Modal isVisible={showModal}>
        <View style={styles.innerModalView}>
          <Text>I am Modal</Text>
          <Button onPress={modalCloseHandler}>Close</Button>
        </View>
      </Modal>
    </View>
  );
}
export default SaveWorkoutModal;

const styles = StyleSheet.create({
  innerModalView: {
    flex: 1,
  },
});
