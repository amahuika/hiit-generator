export function GetExercises(arrayOfExercises, round, length) {
  let exercise;
  const randNum = Math.floor(Math.random() * arrayOfExercises.length);
  console.log(arrayOfExercises[0].id);
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

export function AddBreaks(workoutList) {
  const length = workoutList.length;
  let count = 1;

  for (let i = 0; i < length; i++) {
    let round = workoutList[i].round;
    if (count % 24 === 0) {
      workoutList[i] = {
        name: "Break",
        length: 45,
        round: round,
      };
      // console.log("24th");
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
