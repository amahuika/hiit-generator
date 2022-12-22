import GenerateScreen from "../../screens/GenerateScreen";
import HomeScreen from "../../screens/HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import WorkoutScreen from "../../screens/WorkoutScreen";
import InputWorkoutScreen from "../../screens/InputWorkoutScreen";
import MyWorkoutsScreen from "../../screens/MyWorkoutsScreen";
import DisplaySavedWorkoutScreen from "../../screens/DisplaySavedWorkoutScreen";
import SelectionScreen from "../../screens/SelectionScreen";
import { createStackNavigator } from "@react-navigation/stack";
import CustomInputScreen from "../../screens/CustomInputScreen";
import ExercisesScreen from "../../screens/ExercisesScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CategoryScreen from "../../screens/CategoryScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#393E46" },
        tabBarStyle: {
          backgroundColor: "#393E46",
          borderTopWidth: 0,
          paddingBottom: 4,
        },
        headerTitleStyle: { color: "#00ADB5", fontSize: 24 },
        tabBarActiveTintColor: "#00ADB5",
        tabBarInactiveTintColor: "#EEEEEE",
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="exercise"
        component={ExercisesScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <MaterialCommunityIcons
                name="weight-lifter"
                size={24}
                color={color}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="category"
        component={CategoryScreen}
        options={{
          title: "Categories",
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <MaterialCommunityIcons
                name="format-list-bulleted"
                size={24}
                color={color}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}

function MyStack(props) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          // headerTitleAlign: "center",
          headerTintColor: "#EEEEEE",
          headerStyle: { backgroundColor: "#393E46" },
          headerShadowVisible: false,
          headerTitleStyle: {
            color: "#00ADB5",
            fontSize: 24,
          },
        }}
      >
        <Stack.Screen
          name="home"
          component={HomeScreen}
          options={{ title: "Workout Generator" }}
        />
        <Stack.Screen
          name="myWorkouts"
          component={MyWorkoutsScreen}
          options={{ title: "My Workouts" }}
        />
        <Stack.Screen
          name="displaySavedWorkout"
          component={DisplaySavedWorkoutScreen}
        />
        <Stack.Screen
          name="exercises"
          component={MyTabs}
          options={{ title: "Exercises", headerShown: false }}
        />
        <Stack.Screen
          name="selection"
          component={SelectionScreen}
          options={{ title: "New Workout" }}
        />
        <Stack.Screen
          name="customInput"
          component={CustomInputScreen}
          options={{ title: "Custom Workout" }}
        />
        <Stack.Screen
          name="input"
          component={InputWorkoutScreen}
          options={{ title: "Random Workout" }}
        />
        <Stack.Screen
          name="generator"
          component={GenerateScreen}
          options={{ title: "My Workout" }}
        />
        <Stack.Screen
          name="workout"
          component={WorkoutScreen}
          options={{ headerShown: true }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default MyStack;
