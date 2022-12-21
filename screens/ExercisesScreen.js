import {
  Text,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import MyButton from "../components/MyButton";
import { DatabaseConnection } from "../assets/database/DatabaseConnection";
import Card from "../components/Card";
import RowSpaceBetween from "../components/RowSpaceBetween";
import DisplayList from "../components/ExercisesScreen/DisplayList";
import { useToast } from "react-native-toast-notifications";
import AddNewExerciseModal from "../components/AddNewExerciseModal";

const db = DatabaseConnection.getConnection();

function ExercisesScreen({ navigation, route }) {
  const [categories, setCategories] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [categoryId, setCategoryId] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toast = useToast();

  useEffect(() => {
    navigation.setOptions({
      title: "Exercises",
      headerLeft: () => {
        return (
          <Pressable
            style={{ marginLeft: 16, marginRight: 16 }}
            onPress={returnHome}
          >
            <Ionicons name="home-outline" size={24} color="#EEEEEE" />
          </Pressable>
        );
      },
    });

    if (categories.length === 0) {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT category.id AS value, category.name AS label FROM category",
          [],
          (tx, results) => {
            if (results.rows.length > 0) {
              setCategories((val) => [...results.rows._array]);
            }
          }
        );
      });
    }
  }, []);

  function returnHome() {
    navigation.navigate("home");
  }

  function onSelectCat(catId) {
    setCategoryId(catId);
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM exercises WHERE category_id = ?",
        [catId],
        (tx, results) => {
          if (results.rows.length > 0) {
            setExercises((val) => [...results.rows._array]);
          }
        }
      );
    });
  }

  function onDelete(exerciseId) {
    console.log("on Delete " + exerciseId);
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM exercises WHERE id = ?",
        [exerciseId],
        (tx, results) => {
          if (results.rowsAffected === 1) {
            RefreshExerciseList();
          }
        },
        (tx, error) => {
          console.log(error.messages);
        }
      );
    });
    toast.show("Exercise deleted successfully!", {
      type: "success",
      placement: "bottom",
      animationType: "slide-in",
      duration: 4000,
    });
  }

  function onEdit(id) {
    console.log("Edit: " + id);
  }

  function addNewExercise(name, categoryId, description) {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO exercises (name, category_id, description) VALUES (?,?,?)",
        [name, categoryId, description],
        (tx, results) => {
          console.log(results.rowsAffected);
        }
      );
    });
    RefreshExerciseList();
    toggleModal();
  }

  function toggleModal() {
    isModalOpen ? setIsModalOpen(false) : setIsModalOpen(true);
  }

  function RefreshExerciseList() {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM exercises WHERE category_id = ?",
        [categoryId],
        (tx, results) => {
          setExercises((val) => [...results.rows._array]);
        }
      );
    });
  }
  //   console.log(exercises.map((e) => e.id));
  //to do add a modal component to pop up to enter a new exercise name / category / description is optional.
  // re use the modal component for the custom input page when making a new workout.

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Category</Text>
      <View style={{ flexDirection: "row" }}>
        <SelectDropdown
          data={categories}
          onSelect={(item, index) => {
            onSelectCat(item.value);
          }}
          rowTextForSelection={(item, index) => item.label}
          buttonTextAfterSelection={(item, index) => item.label}
          buttonStyle={{ borderRadius: 4, marginVertical: 8 }}
          buttonTextStyle={{ fontSize: 16 }}
          rowTextStyle={{ fontSize: 16 }}
          dropdownStyle={{ borderRadius: 4 }}
          defaultButtonText="Select a category"
          renderDropdownIcon={() => (
            <Ionicons name="chevron-down" size={24} color="black" />
          )}
        />
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 90 }}>
        {exercises.map((val) => (
          <DisplayList
            key={val.id}
            id={val.id}
            name={val.name}
            description={val.description}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </ScrollView>
      <Pressable
        android_ripple={{ color: "#EEEEEE", foreground: true }}
        style={styles.addButton}
        onPress={toggleModal}
      >
        <Ionicons name="add" size={36} color="#EEEEEE" />
      </Pressable>
      <AddNewExerciseModal
        categories={categories}
        isOpen={isModalOpen}
        toggleModal={toggleModal}
        onAddExercise={addNewExercise}
      />
    </View>
  );
}
export default ExercisesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222831",
  },
  text: {
    color: "#EEEEEE",
  },
  addButton: {
    overflow: "hidden",
    width: 60,
    height: 60,
    borderRadius: 100,
    position: "absolute",
    bottom: 30,
    right: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00ADB5",
  },
});
