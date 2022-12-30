import { useState } from "react";
import { DatabaseConnection } from "../assets/database/DatabaseConnection";

const db = DatabaseConnection.getConnection();

export function dropTables() {
  db.transaction((tx) => {
    tx.executeSql("DROP TABLE category");
    tx.executeSql("DROP TABLE saved_workouts");
    tx.executeSql("DROP TABLE exercises");
    tx.executeSql("DROP TABLE workout_junction");
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
      "CREATE TABLE IF NOT EXISTS category (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255))",
      []
    );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS exercises (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), description VARCHAR(255), category_id INTEGER REFERENCES category(id))",
      []
    );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS saved_workouts (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), length INTEGER, rest INTEGER, break INTEGER, sets INTEGER, rounds INTEGER, total_time VARCHAR(255))",
      []
    );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS workout_junction (id INTEGER PRIMARY KEY AUTOINCREMENT, workout_id INTEGER REFERENCES saved_workouts(id), exercise_id INTEGER REFERENCES exercises(id))",
      []
    );
  });
}

export function saveWorkoutHandler(
  userInput,
  totalWorkoutTime,
  exerciseList,
  breakId
) {
  // userInput, totalWorkoutTime, exerciseList, breakId
  // console.log("Saved! " + workoutName);
  // console.log(filtered.map((item) => item.round));
  // console.log(restLength);
  // console.log(breakLength);

  if (userInput.name === "" || userInput.name === null) {
    return;
  }

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
        }
      },
      (tx, error) => {
        console.log(error.message);
      }
    );
  });

  db.transaction((tx) => {
    for (const exercise of updatedList) {
      tx.executeSql(
        "INSERT INTO workout_junction (workout_id, exercise_id) VALUES (?,?)",
        [lastId, exercise.id],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log("success");
          }
        },
        (tx, error) => {
          console.log(error.message);
        }
      );
    }
  });
}
