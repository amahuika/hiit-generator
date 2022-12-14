import * as SQLite from "expo-sqlite";
// import { Asset } from "expo-asset";
// import * as FileSystem from "expo-file-system";
// import * as SQLite from "react-native-sqlite-storage";

export const DatabaseConnection = {
  getConnection: () => SQLite.openDatabase("work_db.db"),
};
