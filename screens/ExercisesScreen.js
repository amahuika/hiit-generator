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
import { useCallback, useEffect, useState } from "react";
import MyButton from "../components/MyButton";
import { DatabaseConnection } from "../assets/database/DatabaseConnection";
import Card from "../components/Card";
import RowSpaceBetween from "../components/RowSpaceBetween";
import DisplayList from "../components/ExercisesScreen/DisplayList";
import AddNewExerciseModal from "../components/AddNewExerciseModal";
import FloatingButton from "../components/FloatingButton";
import { useFocusEffect } from "@react-navigation/native";
import { useToast } from "react-native-toast-notifications";
const db = DatabaseConnection.getConnection();

function ExercisesScreen({ navigation, route }) {
  const [categories, setCategories] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [categoryId, setCategoryId] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editExercise, setEditExercise] = useState({
    name: undefined,
    category_id: undefined,
    description: null,
  });

  // setting up toast notifications
  const toaster = useToast();
  const toast = {
    showToast: (text) =>
      toaster.show(text, {
        type: "success",
        placement: "bottom",
        animationType: "slide-in",
        duration: 4000,
      }),
  };

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
  }, []);

  useFocusEffect(
    useCallback(() => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT category.id AS value, category.name AS label FROM category",
          [],
          (tx, results) => {
            const noCatObj = { value: null, label: "No Category" };
            if (results.rows.length > 0) {
              setCategories((val) => [...results.rows._array, noCatObj]);
            }
          }
        );
      });
    }, [])
  );

  function returnHome() {
    navigation.navigate("home");
  }

  function onSelectCat(catId) {
    console.log(catId);
    setCategoryId(catId);

    if (catId === null) {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM exercises WHERE category_id IS NULL",
          [],
          (tx, results) => {
            const resultsArray = results.rows._array;
            if (results.rows.length > 0) {
              const filterOutBreak = resultsArray.filter(
                (item) => item.name !== "Break"
              );
              setExercises((val) => [...filterOutBreak]);
            }
          }
        );
      });
    } else {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM exercises WHERE category_id = ?",
          [catId],
          (tx, results) => {
            setExercises((val) => [...results.rows._array]);
          }
        );
      });
    }
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

    toast.showToast("Exercise deleted successfully!");
  }

  function onEdit(id) {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM exercises WHERE id = ?",
        [id],
        (tx, results) => {
          const length = results.rows.length;
          if (length > 0) {
            setEditExercise(results.rows._array[0]);
            console.log(results.rows._array[0]);
          }
        }
      );
    });

    setIsEdit(true);
    toggleModal();
  }

  function addNewExercise(name, categoryId, description) {
    if (isEdit) {
      // console.log("update " + name, categoryId);
      db.transaction((tx) => {
        tx.executeSql(
          "UPDATE exercises SET name = ?, category_id = ?, description = ? WHERE id =?",
          [name, categoryId, description, editExercise.id],
          (tx, results) => {
            console.log(results.rowsAffected);
          }
        );
      });
      toast.showToast("Exercise updated successfully!");
    } else {
      db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO exercises (name, category_id, description) VALUES (?,?,?)",
          [name, categoryId, description],
          (tx, results) => {
            console.log(results.rowsAffected);
          }
        );
      });
      toast.showToast("Exercise Added successfully!");
    }

    toggleModal("close");

    RefreshExerciseList();
  }

  function toggleModal(action) {
    isModalOpen ? setIsModalOpen(false) : setIsModalOpen(true);
    if (action === "close") {
      if (isEdit) {
        setIsEdit(false);
        setEditExercise({
          name: undefined,
          category_id: undefined,
          description: null,
        });
      }
    }
  }

  function RefreshExerciseList() {
    db.transaction((tx) => {
      if (categoryId === null) {
        tx.executeSql(
          "SELECT * FROM exercises WHERE category_id IS NULL",
          [],
          (tx, results) => {
            const resultsArray = results.rows._array;
            if (results.rows.length > 0) {
              const filterOutBreak = resultsArray.filter(
                (item) => item.name !== "Break"
              );

              setExercises((val) => [...filterOutBreak]);
            }
          },
          (tx, error) => {
            console.log(error.message);
          }
        );
      } else {
        tx.executeSql(
          "SELECT * FROM exercises WHERE category_id = ?",
          [categoryId],
          (tx, results) => {
            setExercises((val) => [...results.rows._array]);
          },
          (tx, error) => {
            console.log(error.message);
          }
        );
      }
    });
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
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
        {categoryId === undefined && (
          <Card>
            <Text style={{ textAlign: "center" }}>Select a category</Text>
          </Card>
        )}
        {categoryId !== undefined && (
          <View>
            {exercises.length === 0 && (
              <Card>
                <Text style={{ textAlign: "center" }}>No Results</Text>
              </Card>
            )}
          </View>
        )}
      </ScrollView>

      <FloatingButton Ionicon={"add"} onPress={toggleModal} />

      <AddNewExerciseModal
        isEdit={isEdit}
        editExercise={editExercise}
        categories={categories}
        isOpen={isModalOpen}
        toggleModal={toggleModal}
        onAddExercise={addNewExercise}
        category_Id={categoryId}
      />
    </View>
  );
}
export default ExercisesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222831",
    padding: 8,
  },
  text: {
    color: "#EEEEEE",
  },
});
