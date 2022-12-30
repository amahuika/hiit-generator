import { View, StyleSheet, Text, Pressable, Keyboard } from "react-native";
import Card from "../components/Card";
import { Ionicons } from "@expo/vector-icons";
import CustomForm from "../components/inputWorkoutScreen/CustomForm";
import { DatabaseConnection } from "../assets/database/DatabaseConnection";
import Checkbox from "expo-checkbox";
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
import { useEffect, useState } from "react";
import uuid from "react-native-uuid";
import RowSpaceBetween from "../components/RowSpaceBetween";
import { saveWorkoutHandler } from "../HelperFunctions/DatabaseFunctions";
import { useToast } from "react-native-toast-notifications";
import HideWithKeyboard from "react-native-hide-with-keyboard";
import FloatingButton from "../components/FloatingButton";
import AddNewExerciseModal from "../components/AddNewExerciseModal";

const db = DatabaseConnection.getConnection();

function CustomInputScreen({ route, navigation }) {
  const [categories, setCategories] = useState([]);
  const [exerciseList, setExerciseList] = useState([]);
  const [workoutOrder, setWorkoutOrder] = useState([]);
  const [totalWorkoutTime, setTotalWorkoutTime] = useState("00:00");
  const [exercisesFromDb, setExercisesFromDb] = useState([]);
  const [breakId, setBreakId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  useEffect(() => {
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
            setCategories((val) => [...results.rows._array]);
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
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM exercises WHERE category_id = ?",
        [categoryId],
        (tx, result) => {
          if (result.rows.length > 0) {
            let exercisesFromDb = result.rows._array.map((item) => {
              return {
                name: item.name,
                id: item.id,
                description: item.description,
                category_id: item.category_id,
                isChecked: false,
              };
            });
            setExercisesFromDb((val) => [...exercisesFromDb]);

            // array of ids in already selected exercises
            const exercisesIds = exerciseList.map((val) => val.id);

            // filter out any that have already been selected
            let filtered = exercisesFromDb.filter(
              (val) => !exercisesIds.includes(val.id)
            );

            // set exercises for dropdown
            setExercises((val) => [
              {
                id: new Date().getTime(),
                name: "Break",
                length: parseInt(userInput.break),
                isChecked: false,
              },
              ...filtered,
            ]);
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

  // console.log("workoutOrder length: " + workoutOrder.length);

  // add exercise too list to be displayed on selected exercise
  function onSelectExercise(exercise) {
    // console.log(exercise.id);

    if (exercise.id === undefined || exercise.name === "No Exercises") return;
    const breakObj = {
      id: uuid.v4(),
      name: "Break",
      isChecked: false,
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
  // delete all checked exercises
  function deleteChecked() {
    const updateList = exerciseList.filter((item) => item.isChecked === false);
    setExerciseList((val) => [...updateList]);

    const exercisesIds = updateList.map((val) => val.id);
    let filtered = exercisesFromDb.filter(
      (val) => !exercisesIds.includes(val.id)
    );
    setExercises((val) => [
      {
        id: uuid.v4(),
        name: "Break",
        length: userInput.break,
        isChecked: false,
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
      // saveWorkoutHandler(userInput, totalWorkoutTime, exerciseList, breakId);

      const updatedList = exerciseList.map((e, i) => {
        if (e.name === "Break") {
          return { ...e, id: breakId };
        } else {
          return e;
        }
      });

      let lastId;

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

  function setOptions() {
    navigation.setOptions({
      headerRight: () => {
        return (
          <Pressable style={{ paddingEnd: 24 }} onPress={onSave}>
            <Ionicons name="save-outline" size={30} color="#EEEEEE" />
          </Pressable>
        );
      },
    });
  }

  function addHandle(name, catId, description) {
    // console.log("Add name: " + name);
    // console.log("Add catId: " + catId);
    // console.log("Add desc: " + description);

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

    toggleModal();
  }

  function toggleModal() {
    isModalOpen ? setIsModalOpen(false) : setIsModalOpen(true);
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
          userInput={userInput}
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
              const breakText =
                userInput.break === "" ? "0 sec" : userInput.break + " sec";
              return (
                <ScaleDecorator>
                  <Card style={isBreak ? styles.breakContainer : ""}>
                    <RowSpaceBetween>
                      <View>
                        <View style={{ flexDirection: "row" }}>
                          <View
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Checkbox
                              style={styles.checkBox}
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

                      <Pressable onPressIn={drag} disabled={isActive}>
                        <Ionicons
                          name="reorder-three-outline"
                          size={38}
                          color="black"
                        />
                      </Pressable>
                    </RowSpaceBetween>
                  </Card>
                </ScaleDecorator>
              );
            }}
          />
        </View>
      </NestableScrollContainer>
      <HideWithKeyboard>
        <View style={styles.footer}>
          <Pressable style={{ marginEnd: 32 }} onPress={preview}>
            <Ionicons name="list" size={32} color="#EEEEEE" />
          </Pressable>
          <Pressable style={{ marginEnd: 32 }} onPress={startHandler}>
            <Ionicons name="play" size={32} color="#00ADB5" />
          </Pressable>
          <Pressable onPress={toggleModal}>
            <Ionicons name="add" size={32} color="#EEEEEE" />
          </Pressable>

          <Pressable onPress={deleteChecked}>
            <Ionicons name="trash-outline" size={32} color="#fe7a7a" />
          </Pressable>
        </View>
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

  breakContainer: {
    backgroundColor: "#00ADB5",
  },
  breakText: {
    color: "#EEEEEE",
  },
  checkBox: {
    marginEnd: 10,
    height: 25,
    width: 25,
    padding: 8,
  },
  footer: {
    backgroundColor: "#393E46",
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
