$( document ).ready(function() {
	Parse.initialize("GMS878qYQCgvB68FCzerFKq1TjcHZahOS2hphlRn", "RZcrn0SEBKcwJsvp3HAL7sNVKYPI2ZqMBAN43Jnp");
});

function getEvents() {

}

function currentEventList() {
	var now = new Date();
	now.setHours(0,0,0,0);
	var endDay = Date.now();
	endDay.setHours(23,59,59,59);
	var Event = Parse.Object.extend("Event");
    var currentEventQuery = new Parse.Query(Event);
    currentEventQuery.limit(1);
    currentEventQuery.greaterThan("date", now);
    currentEventQuery.lessThan("date", endDay);
    currentEventQuery.get(null,{
        success: function(result) {
           console.log("Current event: " + result);

        },
        error: function(error) {
           console.log("Failed to get current event. Error: " + error.code + " " + error.message);
        }
    });
}

function upcomingEventList() {
	var now = new Date();
	now.setHours(0,0,0,0);
	now.setDate(now.getDate()+1);	// upcoming event starting tomorrow
    var Event = Parse.Object.extend("Event");
    var upcomingEventQuery = new Parse.Query(Event);
    upcomingEventQuery.limit(3);
    upcomingEventQuery.greaterThan("date", now);
    upcomingEventQuery.get(null,{
        success: function(result) {
            result.set("status", "OPEN");
            result.set("taker", null);
            result.set("type", "emergency");
            result.save(null, {
              success: function(gameScore) {
                getMyShifts();
              },
              error: function(gameScore, error) {
                alert("Failed to save abandon shift. Error: " + error.code + " " + error.message);
              }
            });
        },
        error: function(error) {
           alert("Failed to get abandon shift " + id + ". Error: " + error.code + " " + error.message);
        }
    });
}

function pastEventList() {
	var now = new Date();
	now.setHours(0,0,0,0);
	var Event = Parse.Object.extend("Event");
    var pastEventQuery = new Parse.Query(Event);
    pastEventQuery.limit(3);
    pastEventQuery.lessThan("date", now);
    pastEventQuery.get(null,{
        success: function(result) {
            result.set("status", "OPEN");
            result.set("taker", null);
            result.set("type", "emergency");
            result.save(null, {
              success: function(gameScore) {
                getMyShifts();
              },
              error: function(gameScore, error) {
                alert("Failed to save abandon shift. Error: " + error.code + " " + error.message);
              }
            });
        },
        error: function(error) {
           alert("Failed to get abandon shift " + id + ". Error: " + error.code + " " + error.message);
        }
    });	
}

function saveEvent() {
  var Event = Parse.Object.extend("Event");
  var event = new Event();
  var eventDate = $("#eventDate").val();

  var fileUploadControl = $("#eventImage")[0];
  if (fileUploadControl.files.length > 0) {
    var file = fileUploadControl.files[0];
    var name = "photo.jpg";
   
    var parseFile = new Parse.File(name, file);

    parseFile.save().then(function() {
    }, function(error) {
      alert('Failed to upload image: ' + error.message);
    });
    event.set("image", parseFile);
  }

  event.set("name", $("#eventName").val());
  event.set("date", new Date(eventDate));
   
  event.save(null, {
    success: function(event) {
      $('#eventModal').modal('hide');
    },
    error: function(d, error) {
      // Execute any logic that should take place if the save fails.
      // error is a Parse.Error with an error code and description.
      alert('Failed to create new object, with error code: ' + error.message);
    }
  });
}

function saveFood() {
  var Food = Parse.Object.extend("Food");
  var food = new Food();

  var fileUploadControl = $("#foodImage")[0];
  if (fileUploadControl.files.length > 0) {
    var file = fileUploadControl.files[0];
    var name = "food.jpg";
   
    var parseFile = new Parse.File(name, file);

    parseFile.save().then(function() {
    }, function(error) {
      alert('Failed to upload image: ' + error.message);
    });
    food.set("image", parseFile);
  }

  food.set("name", $("foodName").val())
  food.set("description", $("#foodDescription").val());
  //TODO: add eventId
  food.set("eventId", "");
   
  food.save(null, {
    success: function(food) {
      $('#foodModal').modal('hide');
    },
    error: function(food, error) {
      // Execute any logic that should take place if the save fails.
      // error is a Parse.Error with an error code and description.
      alert('Failed to create new object, with error code: ' + error.message);
    }
  });
}

function formatParseDate(time, timezone) {
  try {
  	console.log("Convert Date WITH timezone" + time);  	
    return moment(time).tz(timezone).format('ddd MM/DD');
  } catch(e) {
  	console.log("Convert Date without timezone");
    return moment(time).format('ddd MM/DD');
  }
}

function formatDate(time, timezone) {
  try {
  	console.log("Convert Date WITH timezone" + time);  	
    return moment(time).tz(timezone).format('ddd MM/DD');
  } catch(e) {
  	console.log("Convert Date without timezone");
    return moment(time).format('ddd MM/DD');
  }
}


function formatTime(time, timezone) {
  try {
  	console.log("Convert Time WITH timezone" + time);
    return moment(time).tz(timezone).format('h:mm A');
  } catch(e) {
  	console.log("Convert Time without timezone");
    return moment(time).format('h:mm A');
  }
}

