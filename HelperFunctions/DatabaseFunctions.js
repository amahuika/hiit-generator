import { DatabaseConnection } from "../assets/database/DatabaseConnection";

const db = DatabaseConnection.getConnection();

function dropTables() {
  db.transaction((tx) => {
    // tx.executeSql("DROP TABLE rounds");
    // tx.executeSql("DROP TABLE saved_workouts");
    // tx.executeSql("DROP TABLE exercises");
    // tx.executeSql("DROP TABLE workout_junction");
  });
}

export function createTable() {
  db.exec(
    [{ sql: "PRAGMA foreign_keys = ON;", args: [] }],
    false,
    (error, result) => {}
  );
  db.transaction((tx) => {
    // tx.executeSql("DROP TABLE saved_workouts");
    // tx.executeSql("DROP TABLE workout_junction");
    // tx.executeSql("DROP TABLE exercises");

    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS exercises (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), type VARCHAR(255), description VARCHAR(255))",
      []
    );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS saved_workouts (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), length VARCHAR(255), rest INTEGER, break INTEGER)",
      []
    );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS workout_junction (id INTEGER PRIMARY KEY AUTOINCREMENT, workout_id INTEGER REFERENCES saved_workouts(id), exercise_id INTEGER REFERENCES exercises(id), round INTEGER)",
      []
    );
  });
}
