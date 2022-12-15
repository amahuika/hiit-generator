import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
} from "react-native";
import MyButton from "../components/MyButton";
import DropDownPicker from "react-native-dropdown-picker";
import Card from "../components/Card";
import { DatabaseConnection } from "../assets/database/DatabaseConnection";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { color } from "react-native-reanimated";

const db = DatabaseConnection.getConnection();

function InputWorkoutScreen({ route, navigation }) {
  const [minutes, setMinutes] = useState(20);
  const [validInput, setValidInput] = useState(true);
  const [isRandom, setIsRandom] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [dummyData, setDummyData] = useState([
    { label: 1, key: 1 },
    { label: 2, key: 2 },
    { label: 3, key: 3 },
    { label: 4, key: 4 },
    { label: 5, key: 5 },
    { label: 6, key: 6 },
  ]);

  const [dropItems, setDropItems] = useState([
    {
      label: "Upper Body",
      value: "Upper Body",
      selectable: false,
    },
    {
      label: "Lower Body",
      value: "Lower Body",
      selectable: false,
    },
    {
      label: "Full Body",
      value: "Full Body",
      selectable: false,
    },
    {
      label: "Core",
      value: "Core",
      selectable: false,
    },
  ]);

  const [allData, setAllData] = useState([]);
  const [order, setOrder] = useState([]);

  useEffect(() => {
    if (allData.length === 0) {
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT exercises.id, exercises.name, exercises.description, category.name AS type
           FROM category INNER JOIN
           exercises ON category.id = exercises.category_id`,
          [],
          (tx, results) => {
            const resultsData = results.rows._array;
            console.log(resultsData);
            setAllData((val) => [...resultsData]);

            const setItems = resultsData.map((item) => {
              return {
                id: item.id,
                label: item.name,
                value: item.name,
                parent: item.type,
              };
            });
            console.log(setItems.length);
            setDropItems((prev) => [...prev, ...setItems]);
          },
          (tx, error) => {
            console.log(error.message);
          }
        );
      });
    }
  }, [allData]);

  function generateHandler() {
    if (minutes > 60) {
      setValidInput(false);
      return;
    }
    navigation.navigate("generator", { minutes: minutes, allData: allData });
  }

  function onRandomHandle() {
    isRandom ? setIsRandom(false) : setIsRandom(true);
  }

  function onCustomHandle() {
    isCustom ? setIsCustom(false) : setIsCustom(true);
  }

  function renderItem({ item, drag, isActive }) {
    return (
      <ScaleDecorator>
        <TouchableOpacity onPressIn={drag} disabled={isActive}>
          <Card>
            <Text style={{ color: "#1a1515" }}>{item.name}</Text>
          </Card>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <>
          <Text style={styles.label}>Enter length in Minutes </Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 20"
            keyboardType="numeric"
            value={minutes}
            onChangeText={setMinutes}
            onSubmitEditing={generateHandler}
          />
          {!validInput && <Text>Please enter a number between 5 and 60</Text>}
          <MyButton
            style={styles.GenerateButton}
            txtStyle={styles.btnText}
            text="Generate"
            onPress={generateHandler}
          />
        </>

        {/* <View>
          <Text style={styles.label}>Select Exercises</Text>
          <DropDownPicker
            open={dropdownOpen}
            value={value}
            items={dropItems}
            setOpen={setDropdownOpen}
            setItems={setDropItems}
            setValue={setValue}
            theme="LIGHT"
            // multiple={true}
            mode="BADGE"
            maxHeight={500}
            badgeDotColors={["#00ADB5"]}
            onSelectItem={(item) => {
              console.log(item.value);
              setOrder((prev) => [...prev, { id: item.id, name: item.value }]);
            }}
          />
        </View> */}
        {/* <DraggableFlatList
          data={order}
          onDragEnd={({ data }) => setOrder(data)}
          keyExtractor={(item, index) => item.id}
          renderItem={renderItem}
        /> */}

        {/* {!isRandom && (
          <MyButton
            style={styles.GenerateButton}
            txtStyle={styles.btnText}
            text="Random Workout"
            onPress={() => {
              setIsCustom(false);
              onRandomHandle();
            }}
          />
        )}
        {!isCustom && (
          <MyButton
            style={styles.GenerateButton}
            txtStyle={styles.btnText}
            text="Custom Workout"
            onPress={() => {
              setIsRandom(false);
              onCustomHandle();
            }}
          />
        )} */}
      </View>
    </View>
  );
}
export default InputWorkoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#222831",
  },
  innerContainer: {
    marginTop: 16,
  },
  GenerateButton: {
    backgroundColor: "#00ADB5",
    marginTop: 16,
  },
  input: {
    padding: 8,
    backgroundColor: "#ffffff",
    borderRadius: 4,
    marginBottom: 8,
  },
  btnText: {
    color: "#EEEEEE",
    fontSize: 24,
  },
  label: {
    color: "#EEEEEE",
  },
});
