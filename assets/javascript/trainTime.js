/**
 * Author: Garret Rueckert
 *
 * U of U Bootcamp Assignment 6 - Train Schedules
 */

//document.onload()

// Initialize Firebase
var config = {
  apiKey: "AIzaSyA7K3xJNAbfiTQNLdMhvZCCU5K_PFoPKtU",
  authDomain: "train-scheduler-e4e7b.firebaseapp.com",
  databaseURL: "https://train-scheduler-e4e7b.firebaseio.com",
  projectId: "train-scheduler-e4e7b",
  storageBucket: "train-scheduler-e4e7b.appspot.com",
  messagingSenderId: "299512391573"
};
firebase.initializeApp(config);

var database = firebase.database();

var tName = "";
var tDest = "";
var minAway = 0;
var tTime;
var tFreq = 0;

function nextTrain(firstTime, tFrequency, mins) {
  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTime, "hh:mm A").subtract(1, "years");
  console.log(firstTimeConverted);
  console.log("First time entered: " + firstTime);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm A"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes"); //moment() makes new current time
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % tFrequency;
  console.log(tRemainder);

  // Minute Until Train
  var minutes = tFrequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + minutes);
  if(mins === true) return minutes;

  // Next Train
  var nextT = currentTime.clone();
  console.log("On initial value: " + nextT)
  nextT.add(minutes, "minutes");
  console.log( "nextT after add: "+ nextT);
  console.log("ARRIVAL TIME: " + moment(nextT).format("hh:mm A"));
  if (mins === false) return moment(nextT).format("hh:mm A");
}

var bullshit = moment("1:45 AM", "hh:mm A");
console.log(bullshit);


database.ref().on("child_added", function(childSnapshot) {
  var entry = childSnapshot.val();
  console.log(childSnapshot);

  

  var rowEntry = $("<tr>");
  var n = $("<td>").text(entry.name);
  var dest = $("<td>").text(entry.destination);
  var fq = $("<td>").text(entry.frequency);
  var next = $("<td>").text(nextTrain(entry.firstTrain, entry.frequency, false));
  var mins = $("<td>").text(nextTrain(entry.firstTrain, entry.frequency, true));

  rowEntry.append(n);
  rowEntry.append(dest);
  rowEntry.append(fq);
  rowEntry.append(next);
  rowEntry.append(mins);

  $("#train-table").append(rowEntry);
});

function validEntry() {
  if (
    $("#tName-input")
      .val()
      .trim() === ""
  )
    return false;
  if (
    $("#tDest-input")
      .val()
      .trim() === ""
  )
    return false;
  if (
    $("#tFreq-input")
      .val()
      .trim() === ""
  )
    return false;
  if (
    $("#tTime-input")
      .val()
      .trim() === ""
  )
    return false;
  return true;
}

/**
 * Event Handlers
 */
$("#submitTrain").on("click", function() {
  if (validEntry) {
    tName = $("#tName-input")
      .val()
      .trim();
    tDest = $("#tDest-input")
      .val()
      .trim();
    tFreq = $("#tFreq-input")
      .val()
      .trim();

    tTime = moment(
      $("#tTime-input")
        .val()
        .trim(),
      "hh:mm A"
    ); //need to use moment

    nextTrain(tTime, tFreq);
  }

  console.log(database);

  //push
  database.ref().push({
    name: tName,
    destination: tDest,
    frequency: tFreq,
    firstTrain: tTime.format("hh:mm A")
  });
});
