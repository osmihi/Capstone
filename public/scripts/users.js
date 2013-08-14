var usersCollection;

function usersScreen() {
	
	refreshFunc = function() {};
	
	$('.navButton').css("font-weight", "normal");
	$('.usersScreen').css("font-weight", "bold");
	
	// API call: request(resource, key, rqType, userInfoString, dataString,
	// successFunc, errorFunc)
	request("tip", "", RequestType.READ, userInfo, "Paid=0", function(response) {
		usersScreen.tipData = response.data;
		
		request('user', '', RequestType.READ, userInfo, '', buildUsersScreen);
	});
}

// response is result of API request call
function buildUsersScreen(response) {
	usersCollection = response.data;
	
	// put tips on each user
	for (var i = 0; i < usersCollection.length; i++) {
		usersCollection[i].tips = new Array();
		usersCollection[i].unpaidTipTotal = 0;
		for (var j = 0; j < usersScreen.tipData.length; j++) {
			if (usersScreen.tipData[j].UserID == usersCollection[i].UserID && usersScreen.tipData[j].Paid == '0') {
				usersCollection[i].tips.push(usersScreen.tipData[j]);
				usersCollection[i].unpaidTipTotal += Number(usersScreen.tipData[j].Amount);
			}
		}
	}
	
	usersCollection.sort(function(objA, objB) {
		var nameA=objA.LName.toLowerCase();
		var nameB=objB.LName.toLowerCase();
		if (nameA < nameB)
			return -1;
		else if (nameA > nameB)
			return 1;
		else return 0;
	});

	usersScreen.users = usersCollection;

	// Wipe page clean (remove previous existing content)
	$('#page').html("");
	
	drawNewUserForm();
	
	// Iterate through USERS, call EMPLOYEES
	for (i = 0; i < usersCollection.length; i++) {
		if (usersCollection[i].Role != 'Administrator') {
			drawEmployees(usersCollection[i]);
		}
	}
	
	setUserRoleDisplays();
	
	addUserClickEvents();
}

function drawNewUserForm() {
	//Add a div with inputs to enter a new user
	$('#page').append(
		'<div id="newUserForm" class="formButton user newUser">'
			+'<input type=button id="addEmployee" class="formButton addEmployeeButton" value="Add"/>'
			+'<div class="inputLabel employeeLabel">Username </div>'
			+'<input type="text" id="newUserName" class="inputField" value=""/>'
			+'<div class="inputLabel employeeLabel col2">First Name </div>'
			+'<input type="text" id="newUserFirstName" class="inputField" value=""/>' + '<br />'
			+'<div class="inputLabel employeeLabel">Password </div>'
			+'<input type="password" id="newUserPassword" class="inputField" value=""/>'
			+'<div class="inputLabel employeeLabel col2">Last Name </div>'
			+'<input type="text" id="newUserLastName" class="inputField" value=""/>' + '<br />'
			+'<div class="inputLabel employeeLabel">Role </div>'
			+'<select id="newUserRole" class="inputField">'
				+'<option value="Host">Host</option>'
				+'<option value="Kitchen Staff">Kitchen Staff</option>'
				+'<option value="Wait Staff">Wait Staff</option>'
				+'<option value="Manager">Manager</option>'
			+'</select>' + '<br />'
		+'</div>'
	);
}


//Add div to page containing employee information
function drawEmployees(user) {
	var tipFieldStr = '';
	var tipButtonStr = '';
	if (user.unpaidTipTotal != 0) {
		tipFieldStr = '<div class="inputLabel employeeLabel col2">Tips Owed</div>'
			+'<input type="text" readonly="true" id="tips' + user.UserID  + '" class="inputField rightAlign" value="' + (user.unpaidTipTotal).toFixed(2) + '"/>';
		tipButtonStr = '<input type="button" class="formButton clearTips" value="Clear Tips"/>';
	}
	
	if(user.Role != 'Administrator'){
		var userDisplayString = 
			'<div id="user' + user.UserID + '" class="formButton user">'
				+'<input type="button" class="formButton submitUserChanges" value="Submit"/>'
				+'<input type="button" class="formButton deleteUser" value="Delete"/>'
				+ tipButtonStr
				+ '<input class="userID" type="hidden" value="'+user.UserID+'"/>'
				+'<div class="inputLabel employeeLabel">Username </div>'
				+'<input type="text" id="userName' + user.UserID  + '" class="inputField" value="' + user.Username + '"/>'
				+'<div class="inputLabel employeeLabel col2">Role </div>'
				+'<select id="user' + user.UserID + 'Role" class="inputField" value="' + user.Role + '">'
					+'<option value="Host">Host</option>'
					+'<option value="Kitchen Staff">Kitchen Staff</option>'
					+'<option value="Wait Staff">Wait Staff</option>'
					+'<option value="Manager">Manager</option>'
				+'</select>' + '<br />'
				+'<div class="inputLabel employeeLabel">Password </div>'
				+'<input type="password" id="password' + user.UserID  + '" class="inputField" value="' + user.PasswordHash + '"/>' + tipFieldStr  + '<br />'
				+'<div class="inputLabel employeeLabel">First Name </div>'
				+'<input type="text" id="fName' + user.UserID  + '" class="inputField" value="' + user.FName + '"/>' + '<br />'
				+'<div class="inputLabel employeeLabel">Last Name </div>'
				+'<input type="text" id="lName' + user.UserID  + '" class="inputField" value="' + user.LName + '"/>' + '<br />'
		+'</div>';
		$('#page').append(userDisplayString);	
	} else {
		drawAdministrator(user);
	}	
}


function drawAdministrator(user){
	var userDisplayString = 
		'<div id="user' + user.UserID + '" class="user">'
			+ '<input class="userID" type="hidden" value="'+user.UserID+'"/>'
			+'<table>'
				+'<tr>'
					+'<td>Last Name: </td>'
					+'<td> &nbsp; '+user.LName + '</td>'
				+'</tr>'
				+'<tr>' 
					+'<td>First Name: </td>' 
					+'<td> &nbsp; ' + user.FName + '</td>'
				+'</tr>'
				+'<tr>'
					+'<td>Role: </td>'
					+ '<td> &nbsp; Administrator</td>'
				+'</tr>'
				+'<tr>'
					+'<td>User Name: </td>'
					+'<td> &nbsp; '+ user.Username + '</td>'
				+'</tr>'
			+'</table>'
							
	+'</div>';
	$('#page').append(userDisplayString);	
}




function setUserRoleDisplays(){
	for (i = 0; i < usersCollection.length; i++) {
		var userRoleID = '#user'+usersCollection[i].UserID+'Role';
		$(userRoleID).val(usersCollection[i].Role);
	}
}



function submitEmployeeChanges(userID){
	var fName = $('#fName'+userID).val();
	var lName = $('#lName'+userID).val();
	var pass = $('#password'+userID).val();
	var role = $('#user'+userID+'Role').val();
	var userName = $('#userName'+userID).val();
	if(userName == "" || userName == null){
		alert("User name must have a value.");
	}
	else if(fName == "" || fName == null){
		alert("First name must have a value.");
	}
	else if(fName == "" || fName == null){
		alert("Last name must have a value.");
	}
	else{
		var queryString = "UserID="+userID+"&FName="+fName+"&LName="+lName+"&Role="+role+"&Username="+userName;
		if(pass != "undefined"){
				queryString += "&PasswordHash="+pass;
		}
		request("user", userID, RequestType.UPDATE, userInfo, queryString, usersScreen, userErrorFunction);		
	}

}


function addNewEmployee(){
	var first = $('#newUserFirstName').val();
	var last = $('#newUserLastName').val();
	var pass = $('#newUserPassword').val();
	var role = $('#newUserRole').val();
	var userName = $('#newUserName').val();
	if(userName == "" || userName == null){
		alert("User name must have a value.");
	}
	else if(pass == "" || pass == null){
		alert("Password name must have a value.");
	}
	else if(first == "" || first == null){
		alert("First name must have a value.");
	}
	else if(last == "" || last == null){
		alert("Last name must have a value.");
	}
	else{
		request("user", "", RequestType.CREATE, userInfo, "&FName="+first+"&LName="+last+"&PasswordHash="+pass+"&Role="+role+"&Username="+userName, usersScreen, userErrorFunction);
	}
}

function addUserClickEvents() {
	// Add click function to buttons
	$('.submitUserChanges').click(function() {
		var userID = $(this).closest('.user').find('.userID').val();
		submitEmployeeChanges(userID);
	});
	
	// Add click function to buttons
	$('.deleteUser').click(function() {
		var isSure = confirm("Are you sure you want to delete this user?");
		if(isSure){
			var userID = $(this).closest('.user').find('.userID').val();
			request("user", userID, RequestType.DELETE, userInfo, "UserID="+userID, usersScreen, userErrorFunction);
		}
	});
	
	// Clear tips function
	$('.clearTips').click(function() {
		if ( confirm("Are you sure you want to clear this user's tips?") ) {
			var userID = $(this).closest('.user').find('.userID').val();
			var tipsToClear = new Array();
			for (var i = 0; i < usersScreen.users.length; i++) {
				if (usersScreen.users[i].UserID == userID) {
					for (var j = 0; j < usersScreen.users[i].tips.length; j++) {
						tipsToClear.push(usersScreen.users[i].tips[j]);
					}
				}
			}
			clearTips(tipsToClear);
		}
		
	});
	
	//Add click function to button
	$('#addEmployee').click(function() {
		addNewEmployee();
	});
}

function clearTips(tipsToClear) {
	if (tipsToClear.length > 0) {
		request('tip', tipsToClear[0].TipID, RequestType.UPDATE, userInfo, 'Paid=1', function() {
			tipsToClear.splice(0,1);
			clearTips(tipsToClear);
		});
	} else {
		usersScreen();
	}
}

function userErrorFunction(){
}

