export function GetExercises(arrayOfExercises, round) {
  let exercise;
  const randNum = Math.floor(Math.random() * arrayOfExercises.length);
  exercise = {
    length: 20,
    round: round,
    title: arrayOfExercises[randNum].exercise,
    description: arrayOfExercises[randNum].description,
  };
  arrayOfExercises.splice(randNum, 1);
  return exercise;
}

export function GetWorkoutOrder(exercisesArr, requiredMinutes) {
  let totalWorkoutTime = 0;

  let exerciseOrder = [];
  let round = 1;

  while (requiredMinutes * 60 > totalWorkoutTime) {
    for (let i = 0; i < exercisesArr.length; i++) {
      if (requiredMinutes * 60 > totalWorkoutTime) {
        exerciseOrder.push(
          exercisesArr[i],
          {
            round: exercisesArr[i].round,
            title: "Rest",
            length: 10,
          },
          exercisesArr[i],
          {
            round: exercisesArr[i].round,
            title: "Rest",
            length: 10,
          },
          exercisesArr[i],
          {
            round: exercisesArr[i].round,
            title: "Rest",
            length: 10,
          }
        );

        totalWorkoutTime += 20 + 10 + 20 + 10 + 20 + 10;
      } else {
        break;
      }
    }
  }
  console.log("total workout time " + totalWorkoutTime);
  console.log("Required time " + requiredMinutes * 60);

  return exerciseOrder;
}

export function AddBreaks(workoutList) {
  const length = workoutList.length;
  let count = 1;
  if (length === 24) {
    workoutList.pop();
  }
  for (let i = 0; i < length; i++) {
    if (count % 24 === 0) {
      workoutList[i] = {
        title: "Break",
        length: 45,
        round: workoutList[i].round,
      };
      console.log("24th");
    }
    count++;
  }
}
