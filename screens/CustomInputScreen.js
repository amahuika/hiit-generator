import { View, StyleSheet, Text, Pressable, Keyboard } from "react-native";
import Card from "../components/Card";
import { Ionicons } from "@expo/vector-icons";
import CustomForm from "../components/inputWorkoutScreen/CustomForm";
import { DatabaseConnection } from "../assets/database/DatabaseConnection";
import DropdownPickers from "../components/inputWorkoutScreen/DropdownPickers";
import {
  ScaleDecorator,
  NestableScrollContainer,
  NestableDraggableFlatList,
} from "react-native-draggable-flatlist";
import {
  displayTimeRemaining,
  generateCustomWorkout,
} from "../HelperFunctions/HelperFunctions";
import { useEffect, useLayoutEffect, useState } from "react";
import uuid from "react-native-uuid";
import RowSpaceBetween from "../components/RowSpaceBetween";
import { saveWorkoutHandler } from "../HelperFunctions/DatabaseFunctions";
import { useToast } from "react-native-toast-notifications";
import HideWithKeyboard from "react-native-hide-with-keyboard";
import FloatingButton from "../components/FloatingButton";
import AddNewExerciseModal from "../components/AddNewExerciseModal";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Footer from "../components/inputWorkoutScreen/Footer";

const db = DatabaseConnection.getConnection();

function CustomInputScreen({ route, navigation }) {
  const [categories, setCategories] = useState([]);
  const [exerciseList, setExerciseList] = useState([]);
  const [workoutOrder, setWorkoutOrder] = useState([]);
  const [totalWorkoutTime, setTotalWorkoutTime] = useState("00:00");
  const [exercisesFromDb, setExercisesFromDb] = useState([]);
  const [breakId, setBreakId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdatedOnEdit, setIsUpdatedOnEdit] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
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

  const toast = useToast();

  const workoutDetails = route.params.workoutDetails;
  const workoutList = route.params.workoutList;
  const exerciseOrder = route.params.exerciseOrder;

  useEffect(() => {
    // set details from edit if they are not null
    if (workoutDetails !== null && !isUpdatedOnEdit) {
      setUserInput((val) => ({
        name: workoutDetails.name,
        sets: workoutDetails.sets,
        length: workoutDetails.length,
        rest: workoutDetails.rest,
        break: workoutDetails.break,
        rounds: workoutDetails.rounds,
      }));
      setExerciseList((val) => [...workoutList]);
      setWorkoutOrder((val) => [...exerciseOrder]);
      console.log(workoutDetails);
      setIsUpdatedOnEdit(true);
    }
    // console.log(userInput);
    // get the break id from db
    if (breakId === null) {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM exercises WHERE name = ?",
          ["Break"],
          (tx, results) => {
            results.rows._array.length !== 0
              ? setBreakId((val) => results.rows._array[0].id)
              : setBreakId(null);
          }
        );
      });
    }
    // get the categories from db
    if (categories.length === 0) {
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
    }
    // generate a workout order if there is exercises selected
    if (exerciseList.length > 0) {
      generatesWorkout();
    } else if (exerciseList.length === 0) {
      setTotalWorkoutTime("00:00");
      setWorkoutOrder([]);
    }
    // console.log("use", isEdit);
    // header options

    setOptions();
  }, [exerciseList, userInput]);

  // console.log(exerciseList.map((val) => val.id));

  // handle form input
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

  // select category populate exercise list based on selected category
  function onSelectCategory(categoryId) {
    // console.log(categoryId);
    setCategoryId(categoryId);

    if (categoryId === null) {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM exercises WHERE category_id IS NULL",
          [],
          (tx, results) => {
            let length = results.rows.length;
            let resultArr = results.rows._array;
            if (length > 0) {
              refreshExerciseLists(resultArr);
            } else {
              setExercises({
                id: new Date().getTime(),
                name: "No Exercises",
              });
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
          "SELECT * FROM exercises WHERE category_id = ?",
          [categoryId],
          (tx, result) => {
            if (result.rows.length > 0) {
              let resultsArr = result.rows._array;
              refreshExerciseLists(resultsArr);
            } else {
              setExercises({
                id: new Date().getTime(),
                name: "No Exercises",
              });
            }
          }
        );
      });
    }
  }

  // console.log("workoutOrder length: " + workoutOrder.length);

  // add exercise too list to be displayed on selected exercise
  function onSelectExercise(exercise) {
    // console.log(exercise.id);

    if (exercise.id === undefined || exercise.name === "No Exercises") return;
    const breakObj = {
      id: uuid.v4(),
      name: "Break",
    };

    // update list of exercises in dropdown and displayed
    let exercisesUpdated = exercises;
    if (exercise.name !== "Break") {
      exercisesUpdated = exercises.filter((item) => item.id !== exercise.id);
    }

    exercisesUpdated.shift();
    setExercises((val) => [breakObj, ...exercisesUpdated]);
    setExerciseList((prev) => [...prev, exercise]);
  }
  // console.log(workoutOrder.length);

  // delete exercises
  function onDelete(id) {
    // console.log(id);
    const updateList = exerciseList.filter((item) => item.id !== id);
    setExerciseList((val) => [...updateList]);

    // get ids from updated list
    const exercisesIds = updateList.map((val) => val.id);

    // filter ids from list for the drop down menu
    let filtered = exercisesFromDb.filter(
      (val) => !exercisesIds.includes(val.id)
    );
    setExercises((val) => [
      {
        id: uuid.v4(),
        name: "Break",
        length: userInput.break,
      },
      ...filtered,
    ]);
  }

  // generate the workout order based on user input
  function generatesWorkout() {
    if (userInput.length === "") {
      return;
    }

    const getWorkoutOrder = generateCustomWorkout(
      userInput,
      exerciseList,
      breakId
    );

    let count = 0;
    getWorkoutOrder.map((item) => (count += item.length));
    const totalTime = displayTimeRemaining(count);
    setTotalWorkoutTime(totalTime);

    setWorkoutOrder((val) => [...getWorkoutOrder]);
    // console.log(workoutOrder);
  }

  // start the workout
  function startHandler() {
    if (workoutOrder.length === 0) return;

    navigation.navigate("workout", {
      workout: workoutOrder,
      workoutInfo: userInput,
      workoutName: userInput.name === "" ? null : userInput.name,
      workoutListForDb: exerciseList,
      workoutTotalTime: totalWorkoutTime,
    });
    // console.log("start");
  }

  function preview() {
    if (workoutOrder.length === 0) return;
    navigation.navigate("preview", {
      workoutList: workoutOrder,
    });
  }

  // on save workout
  function onSave() {
    if (userInput.name === "" || userInput.name === null) return;
    if (exerciseList.length > 0) {
      const updatedList = exerciseList.map((e, i) => {
        if (e.name === "Break") {
          return { ...e, id: breakId };
        } else {
          return e;
        }
      });

      console.log(updatedList);

      let lastId;
      if (workoutDetails !== null) {
        // "UPDATE exercises SET name = ?, category_id = ?, description = ? WHERE id =?",
        // console.log(userInput.length);
        // console.log(totalWorkoutTime);
        db.transaction((tx) => {
          tx.executeSql(
            "DELETE FROM workout_junction WHERE workout_id = ?",
            [workoutDetails.id],
            (tx, results) => {
              if (results.rowsAffected > 0) {
              }
            },
            (_, error) => {
              console.log(error.message);
            }
          );
          tx.executeSql(
            "UPDATE saved_workouts SET name = ?, length = ?, rest = ?, break = ?, sets = ?, rounds = ?, total_time = ? WHERE id = ?",
            [
              userInput.name,
              userInput.length,
              userInput.rest,
              userInput.break,
              userInput.sets,
              userInput.rounds,
              totalWorkoutTime,
              workoutDetails.id,
            ],
            (tx, results) => {
              if (results.rowsAffected > 0) {
                for (const exercise of updatedList) {
                  console.log("Test");
                  tx.executeSql(
                    "INSERT INTO workout_junction (workout_id, exercise_id) VALUES (?,?)",
                    [workoutDetails.id, exercise.id],
                    (tx, results) => {
                      if (results.rowsAffected > 0) {
                      }
                    },
                    (tx, error) => {
                      console.log(error.message);
                    }
                  );
                }
              }
            },
            (tx, error) => {
              console.log(error.message);
            }
          );
        });
        toast.show("  Updated successfully!  ", {
          type: "success",
          duration: 3000,
          placement: "bottom",
        });
        // navigation.goBack();
      } else {
        db.transaction((tx) => {
          tx.executeSql(
            "INSERT INTO saved_workouts (name, length, rest, break, sets, rounds, total_time) VALUES (?,?,?,?,?,?,?)",
            [
              userInput.name,
              userInput.length,
              userInput.rest,
              userInput.break,
              userInput.sets,
              userInput.rounds,
              totalWorkoutTime,
            ],
            (tx, results) => {
              console.log("workout id entered " + results.insertId);
              if (results.insertId > 0) {
                lastId = results.insertId;

                for (const exercise of updatedList) {
                  tx.executeSql(
                    "INSERT INTO workout_junction (workout_id, exercise_id) VALUES (?,?)",
                    [lastId, exercise.id],
                    (tx, results) => {
                      if (results.rowsAffected > 0) {
                      }
                    },
                    (tx, error) => {
                      console.log(error.message);
                    }
                  );
                }

                if (lastId > 0) {
                  toast.show("Workout saved successfully", {
                    duration: 3000,
                    type: "success",
                    placement: "bottom",
                  });
                }
              }
            },
            (tx, error) => {
              console.log(error.message);
            }
          );
        });
      }
    }
  }

  // refreshes exercises lists dropdown and selected when there is change
  function refreshExerciseLists(resultArr) {
    const filteredBreaks = resultArr.filter((e) => e.id !== breakId);
    setExercisesFromDb((val) => [...filteredBreaks]);

    const exercisesIds = exerciseList.map((val) => val.id);
    const filtered = filteredBreaks.filter(
      (val) => !exercisesIds.includes(val.id)
    );
    setExercises((val) => [
      {
        id: new Date().getTime(),
        name: "Break",
        length: parseInt(userInput.break),
      },
      ...filtered,
    ]);
  }

  function setOptions() {
    const renderTitle =
      workoutDetails === null ? "Custom Workout" : "Edit Workout";
    navigation.setOptions({
      title: renderTitle,
    });
  }

  function addHandle(name, catId, description) {
    db.transaction((tx) => [
      tx.executeSql(
        "INSERT INTO exercises (name, category_id, description) VALUES (?,?,?)",
        [name, catId, description],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            toast.show("Exercises added successfully", {
              type: "success",
              duration: 4000,
              placement: "bottom",
            });
          }
        },
        (tx, error) => {
          console.log(error.message);
        }
      ),
    ]);

    // refresh list
    onSelectCategory(categoryId);
    // close modal
    toggleModal();
  }

  function toggleModal() {
    isModalOpen ? setIsModalOpen(false) : setIsModalOpen(true);
  }

  function renderText(isBreak) {
    // console.log(isBreak);
    const set = userInput.sets > 1 ? "sets" : "set";
    if (!isBreak) {
      if (userInput.length === "0" || userInput.length === "") {
        return "";
      } else {
        return `${userInput.length} sec | ${userInput.sets} ${set}`;
      }
    } else if (isBreak) {
      if (userInput.break === "0" || (isBreak && userInput.break === "")) {
        return "";
      } else {
        return `${userInput.break} sec`;
      }
    }
  }

  return (
    <View style={styles.container}>
      <NestableScrollContainer
        contentContainerStyle={{ paddingHorizontal: 8 }}
        stickyHeaderIndices={[1]}
      >
        <CustomForm
          inputHandler={inputHandler}
          totalTime={totalWorkoutTime}
          workoutDetails={workoutDetails}
        />

        <View>
          <DropdownPickers
            categories={categories}
            exercises={exercises}
            onSelectCat={onSelectCategory}
            onSelectExercise={onSelectExercise}
          />
        </View>

        <View style={{ flex: 1 }}>
          <NestableDraggableFlatList
            contentContainerStyle={{ paddingBottom: 150 }}
            scrollEnabled={true}
            data={exerciseList}
            onDragEnd={({ data }) => setExerciseList(data)}
            keyExtractor={(item) => item.id}
            renderItem={({ item, drag, isActive }) => {
              const isBreak = item.name === "Break" ? true : false;
              return (
                <ScaleDecorator>
                  <Card
                    style={[
                      { paddingEnd: 0 },
                      isBreak ? styles.breakContainer : "",
                    ]}
                  >
                    <RowSpaceBetween>
                      <View>
                        <View style={{ flexDirection: "row" }}>
                          <View style={styles.centerView}>
                            <Pressable
                              onPress={() => {
                                onDelete(item.id);
                              }}
                            >
                              <Ionicons
                                name="trash-outline"
                                size={24}
                                color="#f31313"
                              />
                            </Pressable>
                          </View>

                          <View
                            style={{
                              borderLeftWidth: 0.5,
                              borderLeftColor: "black",
                              paddingLeft: 8,
                            }}
                          >
                            <Text style={isBreak ? styles.breakText : ""}>
                              {item.name}
                            </Text>

                            <Text style={isBreak ? styles.breakText : ""}>
                              {renderText(isBreak)}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View style={{ flexDirection: "row" }}>
                        <Pressable onPressIn={drag} disabled={isActive}>
                          <MaterialCommunityIcons
                            name="drag-vertical"
                            size={36}
                            color="black"
                          />
                        </Pressable>
                      </View>
                    </RowSpaceBetween>
                  </Card>
                </ScaleDecorator>
              );
            }}
          />
        </View>
      </NestableScrollContainer>
      <HideWithKeyboard>
        <Footer
          onPreview={preview}
          onSave={onSave}
          onStart={startHandler}
          onToggle={toggleModal}
          workoutDetails={workoutDetails}
        />
      </HideWithKeyboard>

      {/* Need to create props for the add modal & add a button to add a new exercise */}

      <AddNewExerciseModal
        isEdit={false}
        editExercise={null}
        categories={categories}
        isOpen={isModalOpen}
        toggleModal={toggleModal}
        onAddExercise={addHandle}
        category_Id={categoryId}
      />
    </View>
  );
}
export default CustomInputScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
    backgroundColor: "#222831",
  },
  centerView: {
    alignItems: "center",
    justifyContent: "center",
    paddingEnd: 4,
  },
  breakContainer: {
    backgroundColor: "#00ADB5",
  },
  breakText: {
    color: "#EEEEEE",
  },
});
