import { useRef, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Modal from "react-native-modal";
import MyButton from "./MyButton";
import RowSpaceBetween from "./RowSpaceBetween";
import SelectDropdown from "react-native-select-dropdown";
import { Ionicons } from "@expo/vector-icons";

function AddNewExerciseModal({
  categories,
  isOpen,
  toggleModal,
  onAddExercise,
}) {
  const [onFocusStyle, setOnFocusStyle] = useState({
    backgroundColor: "#EEEEEE",
    borderColor: "black",
  });
  const [categoryId, setCategoryId] = useState();
  const [name, setName] = useState();
  const [description, setDescription] = useState(null);
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const descriptionRef = useRef();
  function onAdd() {
    console.log(name, categoryId, description);
    if (name === undefined || (name === "" && categoryId === undefined)) {
      setErrorMessage("*Enter a valid Name and select a Category");
      setIsValid(false);
    } else if (categoryId === undefined) {
      setErrorMessage("*Please select a Category");
      setIsValid(false);
    } else if (name === undefined || name === "") {
      setErrorMessage("*Enter a valid Name");
      setIsValid(false);
    } else {
      setIsValid(true);
      //   console.log("passed");
      onAddExercise(name, categoryId, description);

      setName();
      setCategoryId();
      setDescription(null);
    }
  }

  return (
    <View>
      <Modal isVisible={isOpen} onBackdropPress={() => toggleModal()}>
        <View style={styles.innerModalView}>
          <Text style={{ fontSize: 20 }}>Add new exercise to database</Text>
          {!isValid && <Text style={{ color: "#e36666" }}>{errorMessage}</Text>}
          <View style={[styles.inputContainer]}>
            <Text>Name</Text>
            <TextInput
              value={name}
              style={[styles.input, onFocusStyle]}
              onChangeText={(text) => {
                setIsValid(true);
                setName(text);
              }}
              onFocus={() =>
                setOnFocusStyle({
                  backgroundColor: "#e6dddd",
                  borderColor: "#00ADB5",
                })
              }
              onBlur={() =>
                setOnFocusStyle({
                  backgroundColor: "#EEEEEE",
                  borderColor: "black",
                })
              }
            />
          </View>
          <View style={[styles.inputContainer]}>
            <Text>Category</Text>
            <SelectDropdown
              defaultValue={categoryId}
              data={categories}
              onSelect={(item, index) => {
                setIsValid(true);
                setCategoryId(item.value);
              }}
              rowTextForSelection={(item, index) => item.label}
              buttonTextAfterSelection={(item, index) => item.label}
              buttonStyle={{
                borderRadius: 4,
                marginVertical: 8,
                borderColor: "black",
                borderWidth: 0.5,
              }}
              buttonTextStyle={{ fontSize: 14, color: "#393E46" }}
              rowTextStyle={{ fontSize: 16 }}
              dropdownStyle={{ borderRadius: 4 }}
              defaultButtonText="Select a category"
              renderDropdownIcon={() => (
                <Ionicons name="chevron-down" size={20} color="#393E46" />
              )}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text>Description</Text>
            <TextInput
              value={description}
              style={styles.input}
              multiline={true}
              onChangeText={setDescription}
            />
          </View>

          {/* //Buttons */}
          <RowSpaceBetween>
            <View style={[styles.btnWidth]}>
              <MyButton onPress={onAdd} text={"Add"} />
            </View>
            <View style={[styles.btnWidth]}>
              <MyButton onPress={() => toggleModal()} text={"Cancel"} />
            </View>
          </RowSpaceBetween>
        </View>
      </Modal>
    </View>
  );
}
export default AddNewExerciseModal;

const styles = StyleSheet.create({
  innerModalView: {
    backgroundColor: "#EEEEEE",
    padding: 8,
    borderRadius: 8,
  },
  inputContainer: {
    marginVertical: 4,
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
