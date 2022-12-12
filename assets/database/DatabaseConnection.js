import * as SQLite from "expo-sqlite";
// import { Asset } from "expo-asset";
// import * as FileSystem from "expo-file-system";
// import * as SQLite from "react-native-sqlite-storage";

export const DatabaseConnection = {
  getConnection: () => SQLite.openDatabase("workout_db.db"),
};

// export const DatabaseConnection = {
//   getConnection: () => {
//     openDatabase();
//     return SQLite.openDatabase("workout_db.db");
//   },
// };

// async function openDatabase(pathToDatabaseFile) {
//   if (
//     !(await FileSystem.getInfoAsync(FileSystem.documentDirectory + "SQLite"))
//       .exists
//   ) {
//     await FileSystem.makeDirectoryAsync(
//       FileSystem.documentDirectory + "SQLite"
//     );
//   }
//   await FileSystem.downloadAsync(
//     Asset.fromModule(require("../www/workout_db.db")).uri,
//     FileSystem.documentDirectory + "SQLite/workout_db.db"
//   );
// }
