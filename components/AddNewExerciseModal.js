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
}) {
  const [onFocusStyle, setOnFocusStyle] = useState({
    backgroundColor: "#EEEEEE",
    borderColor: "black",
  });
  const [categoryId, setCategoryId] = useState();
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [isValid, setIsValid] = useState(true);
  const [isUpdateNameOnEdit, setIsUpdateNameOnEdit] = useState(false);
  const [isUpdateDescriptionOnEdit, setIsUpdateDescriptionOnEdit] =
    useState(false);
  const [isUpdateCategoryOnEdit, setIsUpdateCategoryOnEdit] = useState(false);

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

      resetInput();
    }
  }

  function renderNameValue() {
    if (isEdit) {
      if (isUpdateNameOnEdit) {
        return name;
      } else {
        if (name !== editExercise.name) setName(editExercise.name);
        return editExercise.name;
      }
    } else {
      return name;
    }
  }
  function renderDescriptionValue() {
    if (isEdit) {
      if (isUpdateDescriptionOnEdit) {
        return description;
      } else {
        if (description !== editExercise.description)
          setDescription(editExercise.description);
        return editExercise.description;
      }
    } else {
      return description;
    }
  }
  function renderCategory() {
    const index = categories
      .map((item) => item.value)
      .indexOf(editExercise.category_id);

    if (isEdit) {
      if (isUpdateCategoryOnEdit) {
        return null;
      } else {
        if (categoryId !== editExercise.category_id) {
          setCategoryId(editExercise.category_id);
          // setIsUpdateCategoryOnEdit(true);
        }
        return index;
      }
    } else {
      return categoryId;
    }
  }

  function resetInput() {
    setName();
    setDescription();
    setCategoryId();
    setIsUpdateNameOnEdit(false);
    setIsUpdateDescriptionOnEdit(false);
    setIsUpdateCategoryOnEdit(false);
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
      >
        <View style={styles.innerModalView}>
          <Text style={{ fontSize: 20 }}>
            {isEdit ? "Edit exercise" : "Add new exercise to database"}
          </Text>
          {!isValid && <Text style={{ color: "#e36666" }}>{errorMessage}</Text>}
          <View style={[styles.inputContainer]}>
            <Text>Name</Text>
            <TextInput
              value={renderNameValue()}
              style={[styles.input, onFocusStyle]}
              onChangeText={(text) => {
                setIsUpdateNameOnEdit(true);

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
              data={categories}
              defaultValueByIndex={renderCategory()}
              onSelect={(item, index) => {
                setIsValid(true);
                setCategoryId(item.value);
              }}
              onFocus={() => setIsUpdateCategoryOnEdit(true)}
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
              value={renderDescriptionValue()}
              style={styles.input}
              multiline={true}
              onChangeText={(text) => {
                setIsUpdateDescriptionOnEdit(true);
                setDescription(text);
              }}
            />
          </View>

          {/* //Buttons */}
          <RowSpaceBetween>
            <View style={[styles.btnWidth]}>
              <MyButton onPress={onAdd} text={isEdit ? "Update" : "Add"} />
            </View>
            <View style={[styles.btnWidth]}>
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
