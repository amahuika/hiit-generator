import { useEffect, useRef, useState } from "react";
import { Keyboard, StyleSheet, Text, TextInput, View } from "react-native";
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
  isEdit,
  editExercise,
  category_Id,
}) {
  const [onFocusStyle, setOnFocusStyle] = useState({
    borderColor: "#00ADB5",
    borderBottomWidth: 2,
    color: "#017a81",
    backgroundColor: "#EEEEEE",
  });
  const [categoryId, setCategoryId] = useState();
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [isValid, setIsValid] = useState(true);
  const [isFocused, setIsFocused] = useState({
    name: false,
    description: false,
  });
  const [errorMessage, setErrorMessage] = useState("");

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

      resetInput();
    }
  }
  // console.log("cat " + category_Id);

  function renderDefaultCategory() {
    const index = categories.map((item) => item.value).indexOf(category_Id);
    return index;
  }

  function resetInput() {
    setName();
    setDescription();
    setCategoryId();
    setIsFocused((val) => ({ name: false, description: false }));
  }

  function isEditValues() {
    if (category_Id !== undefined) {
      setCategoryId(category_Id);
    }
    if (isEdit) {
      setName(editExercise.name);
      setDescription(editExercise.description);
      setCategoryId(editExercise.category_id);
    }
  }

  return (
    <View>
      <Modal
        isVisible={isOpen}
        onBackdropPress={() => {
          setIsValid(true);
          resetInput();
          toggleModal("close");
        }}
        onShow={() => {
          isEditValues();
        }}
      >
        <View style={styles.innerModalView}>
          <Text style={{ fontSize: 20 }}>
            {isEdit ? "Edit exercise" : "Add new exercise to database"}
          </Text>
          {!isValid && <Text style={{ color: "#e36666" }}>{errorMessage}</Text>}
          <View style={styles.inputContainer}>
            <Text>Name</Text>
            <TextInput
              value={name}
              style={[styles.input, isFocused.name && onFocusStyle]}
              onChangeText={(text) => {
                setIsValid(true);
                setName(text);
              }}
              onFocus={() => setIsFocused((val) => ({ ...val, name: true }))}
              onBlur={() => setIsFocused((val) => ({ ...val, name: false }))}
              autoFocus={true}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text>Category</Text>
            <SelectDropdown
              data={categories}
              defaultValueByIndex={renderDefaultCategory()}
              onSelect={(item, index) => {
                setIsValid(true);
                setCategoryId(item.value);
              }}
              rowTextForSelection={(item, index) => item.label}
              buttonTextAfterSelection={(item, index) => item.label}
              buttonStyle={styles.dropdownBtn}
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
              style={[styles.input, isFocused.description && onFocusStyle]}
              multiline={true}
              onChangeText={setDescription}
              onFocus={() =>
                setIsFocused((val) => ({ ...val, description: true }))
              }
              onBlur={() =>
                setIsFocused((val) => ({ ...val, description: false }))
              }
            />
          </View>

          {/* //Buttons */}
          <RowSpaceBetween style={{ marginTop: 8 }}>
            <View style={styles.btnWidth}>
              <MyButton onPress={onAdd} text={isEdit ? "Update" : "Add"} />
            </View>
            <View style={styles.btnWidth}>
              <MyButton
                onPress={() => {
                  setIsValid(true);
                  resetInput();
                  toggleModal("close");
                }}
                text={"Cancel"}
              />
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
    marginVertical: 8,
  },
  input: {
    fontSize: 16,
    color: "#5a5b5e",
    borderBottomWidth: 0.5,
    borderColor: "black",

    backgroundColor: "#EEEEEE",
  },
  btnWidth: {
    width: "45%",
  },
  dropdownBtn: {
    borderRadius: 4,
    marginVertical: 8,
    borderColor: "black",
    borderWidth: 0.5,
  },
});
