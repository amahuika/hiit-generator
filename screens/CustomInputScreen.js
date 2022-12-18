import {
  View,
  StyleSheet,
  TextInput,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import Card from "../components/Card";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import CustomForm from "../components/inputWorkoutScreen/CustomForm";
import { DatabaseConnection } from "../assets/database/DatabaseConnection";
import SelectDropdown from "react-native-select-dropdown";
import Checkbox from "expo-checkbox";
import { StickyHeaderScrollView } from "react-native-simple-sticky-header";
import DropdownPickers from "../components/inputWorkoutScreen/DropdownPickers";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { displayTimeRemaining } from "../HelperFunctions/HelperFunctions";
const db = DatabaseConnection.getConnection();

function CustomInputScreen(props) {
  const [categories, setCategories] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [exerciseList, setExerciseList] = useState([]);
  const [workoutOrder, setWorkoutOrder] = useState([]);
  const [totalWorkoutTime, setTotalWorkoutTime] = useState("00:00");

  const [exercises, setExercises] = useState([
    { name: "No category selected" },
  ]);
  const [userInput, setUserInput] = useState({
    name: "",
    sets: "1",
    length: "",
    rest: "",
    break: "",
    rounds: "1",
  });

  useEffect(() => {
    console.log("useEffect");
    generatesWorkout();
    if (categories.length === 0) {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT category.id AS value, category.name AS label FROM category",
          [],
          (tx, results) => {
            setCategories((val) => [...results.rows._array]);
          }
        );
      });
    }
  }, [exerciseList, userInput]);

  function inputHandler(input) {
    setUserInput({
      name: input.name,
      sets: input.sets,
      length: input.length,
      rest: input.rest,
      break: input.break,
      rounds: input.rounds,
    });

    // console.log(input);
  }

  function onSelectCategory(categoryId) {
    console.log(categoryId);

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM exercises WHERE category_id = ?",
        [categoryId],
        (tx, result) => {
          // console.log(result.rows._array);

          const exercises = result.rows._array.map((item) => {
            return {
              name: item.name,
              id: item.id,
              description: item.description,
              category_id: item.category_id,
              isChecked: false,
            };
          });

          setExercises((val) => [
            {
              id: new Date().getTime(),
              name: "Break",
              length: userInput.break,
              isChecked: false,
            },
            ...exercises,
          ]);
        }
      );
    });
  }

  function onSelectExercise(exercise) {
    console.log(exercise.id);
    if (exercise.id === undefined) return;

    const exercisesUpdated = exercises.filter(
      (item) => item.id !== exercise.id
    );
    exercisesUpdated.shift();

    setExercises((val) => [
      {
        id: new Date().getTime(),
        name: "Break",
        isChecked: false,
      },
      ...exercisesUpdated,
    ]);
    setExerciseList((prev) => [...prev, exercise]);
  }

  function deleteChecked() {
    const updateList = exerciseList.filter((item) => item.isChecked === false);

    setExerciseList((val) => [...updateList]);
  }

  function generatesWorkout() {
    if (
      userInput.length === "" ||
      userInput.break === "" ||
      userInput.rest === ""
    ) {
      return;
    }
    const numOfSets = parseInt(userInput.sets);
    const numOfRounds = parseInt(userInput.rounds);

    let workoutOrderArray = [];
    const exercisesArray = exerciseList;
    const updatedArray = exercisesArray.map((item) => {
      if (item.name === "Break") {
        return {
          name: item.name,
          id: item.id,
          length: userInput.break,
        };
      } else {
        return {
          name: item.name,
          description: item.description,
          id: item.id,
          length: userInput.length,
        };
      }
    });

    for (const exercise of updatedArray) {
      if (exercise.name !== "Break") {
        for (let i = 0; i < numOfSets; i++) {
          workoutOrderArray.push(exercise, {
            name: "Rest",
            length: userInput.rest,
          });
        }
      } else {
        workoutOrderArray.pop();
        workoutOrderArray.push({
          name: "Break",
          id: exercise.id,
          length: userInput.break,
        });
      }
    }
    if (
      workoutOrderArray.length > 1 &&
      workoutOrderArray[workoutOrderArray.length - 1].name === "Rest"
    ) {
      workoutOrderArray.pop();
    }
    // repeat round
    let addRepeatRound = [];
    for (let i = 0; i < numOfRounds; i++) {
      addRepeatRound.push(...workoutOrderArray);
    }
    let count = 0;
    addRepeatRound.map((item) => (count += parseInt(item.length)));

    const totalTime = displayTimeRemaining(count);
    setTotalWorkoutTime(totalTime);
    setWorkoutOrder((val) => [...addRepeatRound]);
    // console.log(workoutOrder);
  }

  return (
    <View style={styles.container}>
      {!isEdit && (
        <CustomForm
          inputHandler={inputHandler}
          totalTime={totalWorkoutTime}
          userInput={userInput}
        />
      )}
      {/* <ScrollView>
        {workoutOrder.map((item) => (
          <Card>
            <Text>{item.name}</Text>
            <Text>{item.length} sec</Text>
          </Card>
        ))}
      </ScrollView> */}
      <DropdownPickers
        categories={categories}
        exercises={exercises}
        onSelectCat={onSelectCategory}
        onSelectExercise={onSelectExercise}
      />
      <View style={{ flex: 1 }}>
        <DraggableFlatList
          contentContainerStyle={{ paddingBottom: 50 }}
          scrollEnabled={true}
          data={exerciseList}
          onDragEnd={({ data }) => setExerciseList(data)}
          keyExtractor={(item) => item.id}
          renderItem={({ item, drag, isActive }) => {
            const isBreak = item.name === "Break" ? true : false;
            const breakText =
              userInput.break === "" ? "" : userInput.break + " sec";
            return (
              <ScaleDecorator>
                <Card style={isBreak ? styles.breakContainer : ""}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View>
                      <View style={{ flexDirection: "row" }}>
                        {isEdit && (
                          <View
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Checkbox
                              style={{ marginEnd: 10, height: 25, width: 25 }}
                              value={item.isChecked}
                              onValueChange={(value) => {
                                const index = exerciseList.findIndex((obj) => {
                                  return obj.id === item.id;
                                });
                                const updatedList = exerciseList;
                                updatedList[index].isChecked = value;
                                setExerciseList((val) => [...updatedList]);
                              }}
                            />
                          </View>
                        )}
                        <View>
                          <Text style={isBreak ? styles.breakText : ""}>
                            {item.name}
                          </Text>
                          {userInput.length !== "" && (
                            <Text style={isBreak ? styles.breakText : ""}>
                              {isBreak
                                ? breakText
                                : `${userInput.length} sec x${userInput.sets} `}
                            </Text>
                          )}
                        </View>
                      </View>
                    </View>

                    {isEdit && (
                      <Pressable onPressIn={drag} disabled={isActive}>
                        <Ionicons
                          name="reorder-three-outline"
                          size={38}
                          color="black"
                        />
                      </Pressable>
                    )}
                  </View>
                </Card>
              </ScaleDecorator>
            );
          }}
        />
      </View>

      {!isEdit && (
        <Pressable
          android_ripple={{ color: "#EEEEEE", foreground: true }}
          style={styles.editButton}
          onPress={() => setIsEdit(true)}
        >
          <Ionicons name="create-outline" size={36} color="white" />
        </Pressable>
      )}
      {isEdit && (
        <View
          style={{
            backgroundColor: "#393E46",
            padding: 12,
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <Pressable style={{ marginEnd: 32 }} onPress={deleteChecked}>
            <Ionicons name="trash-outline" size={36} color="#fe7a7a" />
          </Pressable>
          <Pressable onPress={() => setIsEdit(false)}>
            <Ionicons name="close" size={36} color="#EEEEEE" />
          </Pressable>
        </View>
      )}
    </View>
  );
}
export default CustomInputScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#222831",
  },
  breakContainer: {
    backgroundColor: "#00ADB5",
  },
  breakText: {
    color: "#EEEEEE",
  },
  editButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "#00ADB5",
    borderRadius: 100,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    overflow: "hidden",
  },
});
