$( document ).ready(function() {
	Parse.initialize("Ok8ye4bKnOx8JM0dEt0oV6NqVwKDwvcYG9ztADdQ", "8HLbHfXM0qJM42K9UmJbCY0uFW0AIVw18tSEuCnm");
    loggedInUser = null;

    parseUsers = [];
    parseUsers["ldPENlwqeu"] = "images/AGrimaldi.png";
    parseUsers["zmryvletxu"] = "images/Angelo.png";
    parseUsers["RqalfQsq7t"] = "images/bluesteel.JPG";

    var cachedUser = Parse.User.current();
        if ( cachedUser != null ) {
            Parse.User.become(cachedUser._sessionToken).then(function(user) {
                    loggedInUser = user;
                    var hashpage = window.location.hash;
                    switch (hashpage) {
                        case "#login":
                        case "":
                            getMyShifts();
                            $.mobile.changePage( '#myshifts', { transition: 'slide'} );
                            break;
                        case "#addshifts":
                            break;
                        case "#browseshifts":
                            getShiftByStatus('OPEN');
                            break;
                        case "#manageemployees":
                            break;
                        case "#myshifts":
                            console.log("#myshifts");
                            getMyShifts();
                            break;
                        case "#myshiftmates":
                            break;
                        case "#shiftinfo":
                            getShiftByStatus('OPEN');
                            $.mobile.changePage( '#browseshifts', { transition: 'slide'} );                            
                            break;
                        case "#profile":
                            break;
                    }
                }, function(error) {
                    alert("Unable to log in. Error:  " + error.message);
                });
        } else {
            $.mobile.changePage( '#login', { transition: 'slide'} );
        }

});

function currentEventList() {
	var now = Date.now();
	now.setHours(0,0,0,0);
	var endDay = Date.now();
	endDay.setHours(23,59,59,59);
	var Event = Parse.Object.extend("Event");
    var currentEventQuery = new Parse.Query(Event);
    currentEventQuery.limit(6);
    currentEventQuery.greaterThan("date", now);
    currentEventQuery.lessThan("date", endDay);
    currentEventQuery.get(null,{
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

function upcomingEventList() {
	var now = Date.now();
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
	var now = Date.now();
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
