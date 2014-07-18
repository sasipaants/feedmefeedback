$( document ).ready(function() {
  // $('#signinModal').modal('show');

  Parse.initialize("GMS878qYQCgvB68FCzerFKq1TjcHZahOS2hphlRn", "RZcrn0SEBKcwJsvp3HAL7sNVKYPI2ZqMBAN43Jnp");
  $('#eventDate').datepicker();
  $('#eventEditDate').datepicker();

  $("#card-current-event").click(function() {
    console.log("Clicking card " );
    // alert( "Handler for .click() called." + ($(this).data("id")));
    loadFoodPage($(this).data("id"));
    // displayFoods($(this).get("eventId"));
    // $.mobile.changePage( '#food', { transition: 'slide'} );
  });

  $(".panel-dislike").click(function() {
    alert( "Handler for .click() called." + ($(this).data('id')));
  });
});

function currentEventList() {
	var now = new Date();
	now.setHours(0,0,0,0);
	var endDay = new Date();
	endDay.setHours(23,59,59,59);
  console.log("Now " + formatDate(now));
  console.log("End day " + formatDate(endDay));
	var Event = Parse.Object.extend("Event");
    var currentEventQuery = new Parse.Query(Event);
    currentEventQuery.limit(1);
    currentEventQuery.greaterThan("date", now);
    currentEventQuery.lessThan("date", endDay);
    currentEventQuery.find({
        success: function(results) {
           	console.log("Current event: " + JSON.stringify(results));
            if ( results.length > 0 ) {

              var result = results[0];
              var editDiv = $("<div class='edit-panel col-md-4' onclick='getEvent(\""+result.id+"\")'><div class='edit-text'>EDIT</div></div>");              
              var imgUrl = "";
              if ( typeof result.get("image").url() != 'undefined' ) {
                imgUrl = result.get("image").url();
              }
              console.log("Image URL " + imgUrl);
              $("#current-event-name").text(result.get("name"));
              $("#current-event-date").text(formatDateLong(result.get("date")));
              $("#card-current-event-name").text(result.get("name"));
              $("#current-event-img").attr("src",imgUrl);
              $("#card-current-event").attr("data-id", result.id);
              if ( isAdmin() ) {
                $("#card-admin-current").append(editDiv);
              }
              upcomingEventList();
            } else {
              $("#current-event").hide();
              $("#upcoming-event").addClass("main-container-top");
              upcomingEventList(); 
            }
            
        },
        error: function(error) {
           console.log("Failed to get current event. Error: " + error);
           $("#current-event").hide();
           $("#upcoming-event").addClass("main-container-top");
           upcomingEventList();

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
    upcomingEventQuery.find({
        success: function(results) {
          console.log("Upcoming event: " + JSON.stringify(results));
          displayEvents(results, "upcoming");
          pastEventList();
        },
        error: function(error) {
           console.log("Failed to get upcoming event. Error: " + error);
           $("#upcoming-event").hide();
           $("#past-event").addClass("main-container-top");
            pastEventList();
        }
    });
}

function pastEventList() {
	var now = new Date();
	now.setHours(0,0,0,0);
  console.log("now: " + now);
	var Event = Parse.Object.extend("Event");
    var pastEventQuery = new Parse.Query(Event);
    pastEventQuery.limit(3);
    pastEventQuery.lessThan("date", now);
    pastEventQuery.descending("date");
    pastEventQuery.find({
        success: function(results) {
          console.log("Past event: " + JSON.stringify(results));
          displayEvents(results, "past");
        },
        error: function(error) {
           console.log("Failed to get past event. Error: " + error);
        }
    });	
}

function getFoodList(eventId) {
    console.log("Getting food for event " + eventId);
    var Food = Parse.Object.extend("Food");
    var foodQuery = new Parse.Query(Food);
    foodQuery.limit(40);
    foodQuery.equalTo("event_id", {
            __type: "Pointer",
            className: "Event",
            objectId: eventId
          });
    foodQuery.find({
        success: function(results) {
          console.log("Found food event_id " + eventId + ": " + JSON.stringify(results));
          displayFoods(results);
        },
        error: function(error) {
           console.log("Failed to get food for event_id " + eventId + ". Error: " + error);
        }
    }); 
}

function displayEvents(events, eType) {
          // <div class="col-md-4 card-event card-upcoming-event">
          //   <img class="img-square" src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" alt="Generic placeholder image">
          //   <div class="card-footer">
          //     Hack Day
          //     <div class="card-footer-date">
          //       July 17, 2014
          //     </div>
          //   </div>
            
          // </div><!-- /.col-lg-3 -->


              // <button class="btn-add" data-toggle="modal" data-target="#myModal">+</button>
  var admin = isAdmin() ;
  var len = events.length;
  var addBtnDiv = $("<button class='btn-add' data-toggle='modal' data-target='#myModal'>+</button>");

  $("#"+ eType +"-event-row").empty();

  for ( var i = 0 ; i < len ; i++ ) {
    var imgUrl = "";
    if ( typeof events[i].get("image").url() != 'undefined' ) {
      imgUrl = events[i].get("image").url();
    }
    // console.log("Event ID " + JSON.stringify(events[i]));
    var cardDiv = $("<div class='card-admin'></div>");
    var colDiv = $("<div id='"+events[i].id+"' class='col-md-4 card-event card-" + eType + "-event' onclick='loadFoodPage(\""+events[i].id+"\")' data-id='"+events[i].id+"'></div>");
    var imgDiv = $("<img class='img-square' src='"+ imgUrl +"' />");
    var footerDiv = $("<div class='card-footer'>"+ events[i].get("name") 
      +"<div class='card-footer-date'>"+ formatDate(events[i].get("date")) +"</div></div>");
    var editDiv = $("<div class='edit-panel col-md-4' onclick='getEvent(\""+events[i].id+"\")'><div class='edit-text'>EDIT</div></div>");

    colDiv.append(imgDiv);
    colDiv.append(footerDiv);

    cardDiv.append(colDiv);
    if ( admin ) {
      cardDiv.append(editDiv);
    }

    $("#"+ eType +"-event-row").append(cardDiv);
     
  }
  if ( admin ) {
    $("#"+ eType +"-event-row").append(addBtnDiv);
  } 
}

function loadFoodPage(eventId) {
  var Event = Parse.Object.extend("Event");
  var query = new Parse.Query(Event);
  query.get(eventId, {
    success: function(event) {
      $("#food-event-id").text(event.id);
      $("#food-event-name").text(event.get("name"));
      $("#food-event-date").text(formatDateLong(event.get("date")));

      getFoodList(eventId);
      $.mobile.changePage( '#food', { transition: 'slide'} );

    },
    error: function(object, error) {
      // The object was not retrieved successfully.
      // error is a Parse.Error with an error code and description.
      alert('Failed to retrieve object, with error code: ' + error.message);
    }
  });
}

function displayFoods(foods) {

          // <div class="card-admin">
          //   <div class="col-md-4 card-food card-current-event">
          //     <img class="img-square" src="" alt="Generic placeholder image">
          //     <div class="card-footer">
          //       <div class="card-footer">
          //        Hack Day
          //        <div class="card-footer-date">
          //          July 17, 2014
          //        </div>
          //      </div>
          //     </div>
          //     <div class="card-button-panel">
          //       <div class="panel-dislike">
          //         <img class="btn-vote btn-dislike" src="img/btn-dislike.png"/>
          //         <p class="count-dislike">5</p>
          //       </div>
          //       <div class="panel-comment">
          //         <img class="btn-vote btn-comment" src="img/btn-comment.png"/>
          //         <p class="count-comment">5</p>
          //       </div>
          //       <div class="panel-like">
          //         <img class="btn-vote btn-like" src="img/btn-like.png"/>
          //         <p class="count-like">5</p>
          //       </div>
                
          //     </div>
          //   </div><!-- /.col-md-4 -->
          //   <div class="edit-panel col-md-4">
          //     <div class="edit-text">EDIT</div>
          //   </div>
          // </div>
  var pastEvent = true;
  var admin = isAdmin() ;        
  var len = foods.length;
  $("#food-row").empty();
  var addBtnDiv = $("<button class='btn-add' data-toggle='modal' data-target='#foodModal'>+</button>");

  for ( var i = 0 ; i < len ; i++ ) {
    var imgUrl = "";
    if ( typeof foods[i].get("image").url() != 'undefined' ) {
      imgUrl = foods[i].get("image").url();
    }
    console.log("Food " + JSON.stringify(foods[i]));

    var pastEventClass = "";
    if ( pastEvent ) {
      pastEventClass = " card-food-past ";
    }

    var foodDescription = foods[i].get("description");
    if (foodDescription.length > 27) {
      foodDescription = foodDescription.substring(0, 27) + "...";
    }

    var cardDiv = $("<div class='card-admin'></div>");
    var colDiv = $("<div id='"+foods[i].id+"' class='col-md-4 card-food "+ pastEventClass+"'></div>");
    var imgDiv = $("<img class='img-square' src='"+ imgUrl +"' />");
    var footerDiv = $("<div class='card-footer'>"+ foods[i].get("name") 
      +"<div class='card-footer-date'>"+ (foodDescription) +"</a></div></div>");
    var buttonPanelDiv = $("<div class='card-button-panel'></div>");
    var dislikePanelDiv = $("<div id='panel-dislike-"+foods[i].id+"' data-id='"+foods[i].id+"' class='panel-dislike'></div>"); 
    var commentPanelDiv = $("<div id='panel-comment-"+foods[i].id+"' data-id='"+foods[i].id+"' class='panel-comment'></div>"); 
    var likePanelDiv = $("<div id='panel-like-"+foods[i].id+"' data-id='"+foods[i].id+"' class='panel-like'></div>"); 

    var dislikeImgDiv = $("<img class='btn-vote btn-dislike' src='img/btn-dislike.png' onclick='incementDisLike(\""+foods[i].id+"\")'/>");
    var commentImgDiv = $("<img class='btn-vote btn-comment' src='img/btn-comment.png'/> ");
    var likeImgDiv = $("<img class='btn-vote btn-like' src='img/btn-like.png' onclick='incementLike(\""+foods[i].id+"\")'/>");

    var dislikeCountDiv = $("<p id='count-dislike-"+foods[i].id+"' class='count-dislike'>"+foods[i].get("dislikes")+"</p>");
    var commentCountDiv = $("<p id='count-comment-"+foods[i].id+"' class='count-comment'>0</p>");
    var likeCountDiv = $("<p id='count-like-"+foods[i].id+"' class='count-like'>"+foods[i].get("likes")+"</p>");

    var editDiv = $("<div class='edit-panel col-md-4' onclick='getFood(\""+foods[i].id+"\")'><div class='edit-text'>EDIT</div></div>");


    dislikePanelDiv.append(dislikeImgDiv);
    dislikePanelDiv.append(dislikeCountDiv);

    commentPanelDiv.append(commentImgDiv);
    commentPanelDiv.append(commentCountDiv);

    likePanelDiv.append(likeImgDiv);
    likePanelDiv.append(likeCountDiv);

    buttonPanelDiv.append(dislikePanelDiv);
    buttonPanelDiv.append(commentPanelDiv);
    buttonPanelDiv.append(likePanelDiv);

    colDiv.append(imgDiv);
    colDiv.append(footerDiv);
    if ( pastEvent ) {
      colDiv.append(buttonPanelDiv);      
    }
    console.log(colDiv);

    cardDiv.append(colDiv);
    if ( admin ) {
      cardDiv.append(editDiv);
    }
    $("#food-row").append(cardDiv)
  }

  if ( admin ) {
    $("#food-row").append(addBtnDiv);
  }
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

function getEventLite(eventId) {
  var Event = Parse.Object.extend("Event");
  var query = new Parse.Query(Event);
  query.get(eventId, {
    success: function(event) {
      var eventDate = formatDateSimple(event.get("date"));
      $('#eventEditModal').modal('show');
      $("#eventEditName").val(event.get("name"));
      $("#eventEditDate").val(eventDate);
      $("#eventEditId").val(eventId);
    },
    error: function(object, error) {
      // The object was not retrieved successfully.
      // error is a Parse.Error with an error code and description.
      alert('Failed to retrieve object, with error code: ' + error.message);
    }
  });
}

function getEvent(eventId) {
  var Event = Parse.Object.extend("Event");
  var query = new Parse.Query(Event);
  query.get(eventId, {
    success: function(event) {
      var eventDate = formatDateSimple(event.get("date"));
      $('#eventEditModal').modal('show');
      $("#eventEditName").val(event.get("name"));
      $("#eventEditDate").val(eventDate);
      $("#eventEditId").val(eventId);
    },
    error: function(object, error) {
      // The object was not retrieved successfully.
      // error is a Parse.Error with an error code and description.
      alert('Failed to retrieve object, with error code: ' + error.message);
    }
  });
}

function updateEvent() {
  var eventId = $("#eventEditId").val();
  var Event = Parse.Object.extend("Event");
  var query = new Parse.Query(Event);
  query.get(eventId, {
    success: function(event) {
      console.log("event: " + event.get("date"));
      var eventDate = $("#eventEditDate").val();

      var fileUploadControl = $("#eventEditImage")[0];
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

      event.set("name", $("#eventEditName").val());
      event.set("date", new Date(eventDate));

      console.log("date: ", eventDate);
       
      event.save();
      $('#eventEditModal').modal('hide');
    },
    error: function(object, error) {
      // The object was not retrieved successfully.
      // error is a Parse.Error with an error code and description.
      alert('Failed to retrieve object, with error code: ' + error.message);
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

  food.set("name", $("#foodName").val());
  food.set("description", $("#foodDescription").val());
  food.set("likes", 0);
  food.set("dislikes", 0)
  food.set("event_id",  {
            __type: "Pointer",
            className: "Event",
            objectId: $("#food-event-id").text()
          });

  food.save(null, {
    success: function(food) {
      $('#foodModal').modal('hide');
      loadFoodPage($("#food-event-id").text());
    },
    error: function(food, error) {
      // Execute any logic that should take place if the save fails.
      // error is a Parse.Error with an error code and description.
      alert('Failed to create new object, with error code: ' + error.message);
      alert('food: ' + food.toJSON());
    }
  });
}

function getFood(foodId) {
  var Food = Parse.Object.extend("Food");
  var query = new Parse.Query(Food);
  query.get(foodId, {
    success: function(food) {
      $('#foodEditModal').modal('show');
      $("#foodEditName").val(food.get("name"));
      $("#foodEditDescription").val(food.get("description"));
      $("#foodEditId").val(food.id);

    },
    error: function(object, error) {
      // The object was not retrieved successfully.
      // error is a Parse.Error with an error code and description.
      alert('Failed to retrieve object, with error code: ' + error.message);
    }
  });
}

function updateFood() {
  var foodId = $("#foodEditId").val();
  var Food = Parse.Object.extend("Food");
  var query = new Parse.Query(Food);
  query.get(foodId, {
    success: function(food) {
      var fileUploadControl = $("#foodEditImage")[0];
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

      food.set("name", $("#foodEditName").val());
      food.set("description", $("#foodEditDescription").val());
       
      food.save();
      $('#foodEditModal').modal('hide');
      loadFoodPage($("#food-event-id").text());

    },
    error: function(object, error) {
      // The object was not retrieved successfully.
      // error is a Parse.Error with an error code and description.
      alert('Failed to retrieve object, with error code: ' + error.message);
    }
  });
}

function incementLike(foodId) {
  var Food = Parse.Object.extend("Food");
  var query = new Parse.Query(Food);
  query.get(foodId, {
    success: function(food) {
      food.increment("likes");
      food.save();
      console.log("Updated like on food id " + foodId);
      var count = parseInt($("#count-like-" + foodId).text());
      count++;
      $("#count-like-" + foodId).text(count);
    },
    error: function(object, error) {
      // The object was not retrieved successfully.
      // error is a Parse.Error with an error code and description.
      alert('Failed to retrieve object, with error code: ' + error.message);
    }
  });
}

function incementDisLike(foodId) {
  var Food = Parse.Object.extend("Food");
  var query = new Parse.Query(Food);
  query.get(foodId, {
    success: function(food) {
      food.increment("dislikes");
      food.save();
      console.log("Updated dislike on food id " + foodId);
      var count = parseInt($("#count-dislike-" + foodId).text());
      count++;
      $("#count-dislike-" + foodId).text(count);
    },
    error: function(object, error) {
      // The object was not retrieved successfully.
      // error is a Parse.Error with an error code and description.
      alert('Failed to retrieve object, with error code: ' + error.message);
    }
  });
}

function signIn() {
  var entered = $("#username").val();
  console.log(entered);
  $("#loggedinUser").text(entered);
  var cookie = "username="+$("#username").val()+"; expires=Fri, 25 Jul 2014 20:47:11 UTC; domain=http://feedmefeedback.parseapp.com/";
  document.cookie= cookie;
  // alert(document.cookie);
  $('#signinModal').modal('hide');
  currentEventList();
  var name = "username=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) {
          console.log("username = "+c.substring(name.length,c.length));
        }
    }
    return "";
}

function setCookie(c_name,value,exdays)
    {
      var exdate=new Date();
      exdate.setDate(exdate.getDate() + exdays);
      var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
      document.cookie=c_name + "=" + c_value;
    }
    
    function getCookie(c_name)
    {
      var c_value = document.cookie;
      var c_start = c_value.indexOf(" " + c_name + "=");
      if (c_start == -1)
      {
        c_start = c_value.indexOf(c_name + "=");
      }
      if (c_start == -1)
      {
        c_value = null;
      }
      else
      {
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end == -1)
        {
          c_end = c_value.length;
        }
        c_value = unescape(c_value.substring(c_start,c_end));
      }
      return c_value;
    }
    
    function checkCookie()
    {
      var username=getCookie("username");
      if (username!=null && username!="")
      {
          $("#loggedinUser").text(username);
          document.getElementById("username").innerHTML = (username);
      }
      else 
      {
        username=prompt("Please enter your name:","");
        username = $.trim(username);
        if (username!=null && username!="" && username!="null" && username.length > 2)
        {
          setCookie("username",username,90);
          $("#loggedinUser").text(username);
          document.getElementById("username").innerHTML = (username);
        } else {
          username = null;
          alert("Please enter valid username of 2 or more characters.");
          checkCookie();
        }
      }
    }
    
    function deleteUsernameCookie() {

        document.cookie = 'username=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        location.reload();

    };

function isAdmin() {
  if ( ($("#loggedinUser").text()) == "Admin" ) {
    return true;
  }
  return false;
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

function formatDateLong(time, timezone) {
  try {
    console.log("Convert Date WITH timezone" + time);   
    return moment(time).tz(timezone).format('dddd MMMM DD, YYYY');
  } catch(e) {
    console.log("Convert Date without timezone");
    return moment(time).format('dddd MMMM DD, YYYY');
  }
}

function formatDate(time, timezone) {
  try {
  	console.log("Convert Date WITH timezone" + time);  	
    return moment(time).tz(timezone).format('ddd MMM DD, YYYY');
  } catch(e) {
  	console.log("Convert Date without timezone");
    return moment(time).format('ddd MMM DD, YYYY');
  }
}

function formatDateSimple(date) {
  try {
    console.log("Convert Date, no time");   
    return moment(date).format('MM/DD/YYYY');
  } catch(e) {
    console.log("Convert Date without timezone");
    return moment(date).format('ddd MM/DD');
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

