// import { DBCoreRangeType } from "dexie";

export function GetExercises(arrayOfExercises, round, length) {
  let exercise;
  const randNum = Math.floor(Math.random() * arrayOfExercises.length);

  exercise = {
    id: arrayOfExercises[randNum].id,
    length: length,
    round: round,
    name: arrayOfExercises[randNum].name,
    description: arrayOfExercises[randNum].description,
    type: arrayOfExercises[randNum].type,
  };
  arrayOfExercises.splice(randNum, 1);
  return exercise;
}

export function GetWorkoutOrder(exercisesArr, requiredMinutes) {
  let totalWorkoutTime = 0;

  let exerciseOrder = [];

  while (requiredMinutes * 60 > totalWorkoutTime) {
    for (let i = 0; i < exercisesArr.length; i++) {
      if (requiredMinutes * 60 > totalWorkoutTime) {
        exerciseOrder.push(
          exercisesArr[i],
          {
            round: exercisesArr[i].round,
            name: "Rest",
            length: 10,
          },
          exercisesArr[i],
          {
            round: exercisesArr[i].round,
            name: "Rest",
            length: 10,
          },
          exercisesArr[i],
          {
            round: exercisesArr[i].round,
            name: "Rest",
            length: 10,
          }
        );

        totalWorkoutTime += 20 + 10 + 20 + 10 + 20 + 10;
      } else {
        break;
      }
    }
  }
  // console.log("total workout time " + totalWorkoutTime);
  // console.log("Required time " + requiredMinutes * 60);

  return exerciseOrder;
}

export function AddBreaks(workoutList, breakId) {
  const length = workoutList.length;
  let count = 1;

  for (let i = 0; i < length; i++) {
    let round = workoutList[i].round;
    if (count % 24 === 0) {
      workoutList[i] = {
        name: "Break",
        length: 45,
        round: round,
        id: breakId,
      };
    }
    count++;
  }
  if (length === 24) {
    workoutList.pop();
  }

  const lastElementIndex = workoutList.length - 1;
  if (
    workoutList[lastElementIndex].name === "Break" ||
    workoutList[lastElementIndex].name === "Rest"
  ) {
    workoutList.pop();
  }
  workoutList.unshift({ name: "Get Ready", length: 10 });
}

export function displayTimeRemaining(totalSeconds) {
  const toMinutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${toMinutes.toString().padStart(2, 0)}:${seconds
    .toString()
    .padStart(2, 0)}`;
}

export function generateCustomWorkout(userInput, exerciseList, breakId) {
  if (userInput.length === "" || exerciseList.length === 0) {
    return;
  }
  const numOfSets = parseInt(userInput.sets);
  const numOfRounds = parseInt(userInput.rounds);
  const breakLength = userInput.break === "" ? 0 : parseInt(userInput.break);
  const restLength = userInput.rest === "" ? 0 : parseInt(userInput.rest);
  const exerciseLength = parseInt(userInput.length);
  const breakObj = { name: "Break", id: breakId, length: breakLength };

  let workoutOrderArray = [];
  const exercisesArray = exerciseList;
  const updatedArray = exercisesArray.map((item) => {
    if (item.name === "Break") {
      return breakObj;
    } else {
      return {
        name: item.name,
        description: item.description,
        id: item.id,
        length: exerciseLength,
      };
    }
  });

  for (const exercise of updatedArray) {
    if (exercise.name !== "Break") {
      for (let i = 0; i < numOfSets; i++) {
        workoutOrderArray.push(exercise, {
          name: "Rest",
          length: restLength,
        });
      }
    } else {
      workoutOrderArray.pop();
      workoutOrderArray.push(breakObj);
    }
  }

  if (restLength === 0)
    workoutOrderArray = workoutOrderArray.filter((i) => i.name !== "Rest");
  console.log(workoutOrderArray.map((e) => e.name));
  // repeat rounds based on user input
  // remove last element if break or rest

  const updateWorkoutOrder =
    workoutOrderArray.length >= 2
      ? checkLastForBreakOrRest(workoutOrderArray)
      : workoutOrderArray;

  let addRepeatRound = [];
  if (numOfRounds > 1) updateWorkoutOrder.push(breakObj);

  console.log(updateWorkoutOrder.map((e) => e.name));

  for (let i = 0; i < numOfRounds; i++) {
    addRepeatRound.push(...updateWorkoutOrder);
  }
  const finalUpdatedWorkoutOrder =
    addRepeatRound.length >= 2
      ? checkLastForBreakOrRest(addRepeatRound)
      : addRepeatRound;

  return finalUpdatedWorkoutOrder;
}

function checkLastForBreakOrRest(arr) {
  const arrClone = arr;
  const lastIndex = arrClone.length - 1;

  if (
    arrClone[lastIndex].name === "Break" ||
    arrClone[lastIndex].name === "Rest"
  ) {
    arrClone.pop();
  }

  return arrClone;
}
// let count = 0;
// addRepeatRound.map((item) => (count += item.length));
// const totalTime = displayTimeRemaining(count);
// setTotalWorkoutTime(totalTime);
