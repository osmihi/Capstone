var usersCollection;

function usersScreen() {
	
	refreshFunc = function() {};
	
	// API call: request(resource, key, rqType, userInfoString, dataString,
	// successFunc, errorFunc)
	request("user", "", RequestType.READ, userInfo, "", buildUsersScreen);
}

// response is result of API request call
function buildUsersScreen(response) {
	usersCollection = response.data;
	
	usersCollection.sort(function(objA, objB) {
		var nameA=objA.LName.toLowerCase();
		var nameB=objB.LName.toLowerCase();
		if (nameA < nameB)
			return -1;
		else if (nameA > nameB)
			return 1;
		else return 0;
	});

	// Wipe page clean (remove previous existing content)
	$('#page').html("");
	
	drawNewUserForm()
	
	// Iterate through USERS, call EMPLOYEES
	for (i = 0; i < usersCollection.length; i++) {
		drawEmployees(usersCollection[i]);
	}
	
	setUserRoleDisplays();
	
	addUserClickEvents();
}

function drawNewUserForm() {

	//Add a div with inputs to enter a new user
	$('#page').append(
			'<div id="newUserForm" class="user">'
			+'<table>'
				+'<tr>'
					+'<td>Last Name: </td>'
					+'<td><input type="text" id="newUserLastName" value=""/></td>'
				+'</tr>'
				+'<tr>' 
					+'<td>First Name: </td>'
					+'<td><input type="text" id="newUserFirstName" value=""/></td>'
				+'</tr>'
				+'<tr>'
					+'<td>Password: </td>'
					+'<td><input type="password" id="newUserPassword" value=""/></td>'
				+'</tr>'
				+'<tr>'
					+'<td>Role: </td>'
					+'<td><select id="newUserRole"><value="<option></option><option>Host</option><option>Kitchen Staff</option><option>Wait Staff</option><option>Manager</option>"</select></td>'
				+'</tr>'
				+'<tr>'
					+'<td>User Name: </td>'
					+'<td><input type="text" id="newUserName" value=""/></td>'
			+'</tr>'
			+'</table>'
			
			+'<input type=button id="addEmployee" value="Add Employee"/><br />'
			+
						
		'</div>');
}


//Add div to page containing employee information
function drawEmployees(user) {
	if(user.Role != 'Administrator'){
		var userDisplayString = 
			'<div id="user' + user.UserID + '" class="user">'
				+ '<input class="userID" type="hidden" value="'+user.UserID+'"/>'
				+'<table>'
					+'<tr>'
						+'<td>Last Name: </td>'
						+'<td><input type="text" id="lName' + user.UserID  + '" value="' + user.LName + '"/></td>'
					+'</tr>'
					+'<tr>' 
						+'<td>First Name: </td>'
						+'<td><input type="text" id="fName' + user.UserID  + '" value="' + user.FName + '"/></td>'
					+'</tr>'
					+'<tr>'
						+'<td>Password: </td>'
						+'<td><input type="password" id="password' + user.UserID  + '" value="' + user.PasswordHash + '"/></td>'
					+'</tr>'
					+'<tr>'
						+'<td>Role: </td>'
						+'<td><select id="user'+user.UserID+'Role"><value="<option></option><option>Host</option><option>Kitchen Staff</option><option>Wait Staff</option><option>Manager</option>"</select></td>'
					+'</tr>'
					+'<tr>'
						+'<td>User Name: </td>'
						+'<td><input type="text" id="userName' + user.UserID  + '" value="' + user.Username + '"/></td>'
					+'</tr>'
				+'</table>'
				+'<input type=button class="submitUserChanges" value="Submit"/><input type=button class="deleteUser" value="Delete"/><br />'				
		+'</div>';
		$('#page').append(userDisplayString);	
	}

	else{
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
	var queryString = "FName="+fName+"&LName="+lName+"&PasswordHash="+pass+"&Role="+role+"&Username="+userName;
	request("user", userID, RequestType.UPDATE, userInfo, queryString, usersScreen, userErrorFunction);
}


function addNewEmployee(){
	var first = $('#newUserFirstName').val();
	var last = $('#newUserLastName').val();
	var pass = $('#newUserPassword').val();
	var role = $('#newUserRole').val();
	var userName = $('#newUserName').val();
	request("user", "", RequestType.CREATE, userInfo, "FName="+first+"&LName="+last+"&PasswordHash="+pass+"&Role="+role+"&Username="+userName, usersScreen, userErrorFunction);
}

function addUserClickEvents() {
	// Add click function to buttons
	$('.submitUserChanges').click(function() {
		var userID = $(this).closest('.user').find('.userID').val();
		submitEmployeeChanges(userID);
	});
	
	// Add click function to buttons
	$('.deleteUser').click(function() {
		var userID = $(this).closest('.user').find('.userID').val();
		request("user", userID, RequestType.DELETE, userInfo, "UserID="+userID, usersScreen, userErrorFunction);		
	});
	
	//Add click function to button
	$('#addEmployee').click(function() {
		addNewEmployee();
	});
}

function userErrorFunction(){
}

