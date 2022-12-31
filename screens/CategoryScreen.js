import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import Card from "../components/Card";
import { Ionicons } from "@expo/vector-icons";
import { useToast } from "react-native-toast-notifications";

import { DatabaseConnection } from "../assets/database/DatabaseConnection";
import DisplayList from "../components/ExercisesScreen/DisplayList";
import FloatingButton from "../components/FloatingButton";
import CategoryModal from "../components/CategoryModal";

const db = DatabaseConnection.getConnection();

function CategoryScreen({ navigation }) {
  const [categoryList, setCategoryList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [catForEdit, setCatForEdit] = useState(null);

  const [showModal, setShowModal] = useState(false);

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
      title: "Category",
      headerLeft: () => {
        return (
          <Pressable
            style={{ marginLeft: 16, marginRight: 16 }}
            onPress={() => navigation.navigate("home")}
          >
            <Ionicons name="arrow-back" size={24} color="#EEEEEE" />
          </Pressable>
        );
      },
    });

    refreshCatList();
  }, []);

  function onDelete(catId) {
    // console.log(catId);
    Alert.alert(
      "Delete category?",
      "Exercises in this category will be assigned No Category you can view these exercises in the exercises page",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () =>
            db.transaction((tx) => {
              tx.executeSql(
                "UPDATE exercises SET category_id = ? WHERE category_id = ?",
                [null, catId],
                (tx, results) => {
                  const rowsAffected = results.rowsAffected;
                  console.log("updated rows " + rowsAffected);

                  tx.executeSql(
                    "DELETE FROM category WHERE id = ?",
                    [catId],
                    (tx, results) => {
                      const rowsAffected = results.rowsAffected;
                      console.log("deleted rows " + rowsAffected);
                      if (rowsAffected > 0) {
                        refreshCatList();
                        toast.showToast("Category deleted successfully!");
                      }
                    },
                    (tx, error) => {
                      console.log(error.message);
                    }
                  );
                },
                (tx, error) => {
                  console.log(error.message);
                }
              );
            }),
        },
      ]
    );
  }

  function refreshCatList() {
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM category", [], (tx, results) => {
        const length = results.rows.length;
        // console.log(length);
        if (length > 0) {
          setCategoryList((prev) => [...results.rows._array]);
        }
      });
    });
  }

  function onEdit(id) {
    console.log("edit " + id);
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM category WHERE id = ?",
        [id],
        (tx, results) => {
          const length = results.rows.length;
          if (length > 0) {
            setCatForEdit(results.rows._array[0]);
            setIsEdit(true);
          }
        }
      );
    });

    toggleModal();
  }

  function toggleModal(action) {
    showModal ? setShowModal(false) : setShowModal(true);
    if (action === "close") {
      setCatForEdit(null);
      setIsEdit(false);
    }
  }

  function onAddHandler(categoryName) {
    console.log(categoryName);
    if (isEdit) {
      // update query here
      db.transaction((tx) => {
        tx.executeSql(
          "UPDATE category SET name = ? WHERE id = ?",
          [categoryName, catForEdit.id],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              refreshCatList();
              toggleModal("close");
              toast.showToast("Category updated successfully!");
            }
          },
          (tx, error) => {
            console.log(error.message);
          }
        );
      });
    } else {
      db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO category (name) VALUES (?)",
          [categoryName],
          (tx, results) => {
            const addedRow = results.rowsAffected;
            console.log(addedRow);
            if (addedRow > 0) {
              refreshCatList();
              toggleModal();
              toast.showToast("Category added successfully!");
            }
          }
        );
      });
    }

    // setCatForEdit(null);
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 90 }}>
        {categoryList.map((item) => (
          <DisplayList
            key={item.id}
            id={item.id}
            name={item.name}
            description={null}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </ScrollView>
      <CategoryModal
        toggleModal={toggleModal}
        isOpen={showModal}
        onAdd={onAddHandler}
        catForEdit={catForEdit}
      />
      <FloatingButton Ionicon={"add"} onPress={toggleModal} />
    </View>
  );
}
export default CategoryScreen;

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
