// request all users
// foreach user in users:
//	create user div
//		First name, last name, role
//  click function on user div -> employeeScreen(user)

//Employee screen:
//  inputs for each user field 
//  text inputs for name, username, password, 
//	select list for role (hardcoded roles), 
//	checkbox for locked  
//	submit -> click -> put request, usersScreen()
//when form is submitted, if there is no password in the password field, 
//then the old password is retained

//Called to render users screen

function usersScreen() {
	// API call: request(resource, key, rqType, userInfoString, dataString,
	// successFunc, errorFunc)
	
	alert("usersScreen()");
	request("user", "", RequestType.READ, userInfo, "", buildUsersScreen);
}

// response is result of API request call
function buildUsersScreen(response) {
	
	var employees = response.data;
	

	employees.sort(function(objA, objB) {
		if (objA.LName < objB.LName)
			return -1;
		else
			return 1;
	});


	// Wipe page clean (remove previous existing content)
	$('#page').html("");
	
	drawNewUserForm()
	
	// Iterate through USERS, call EMPLOYEES
	for (i = 0; i < employees.length; i++) {
		drawEmployees(employees[i]);
	}
	
	addClickEvents();
}

function drawNewUserForm() {

	//Add a div with inputs to enter a new user
	$('#page').append(
			'<div id="newUserForm" class="newUserForm">'
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
					+'<td><input type="text" id="newUserPassword" value=""/></td>'
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


// Creates box containing menu items
function drawEmployees(user) {
	// Add div with menu items page div
	$('#page').append(
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
						+'<td><input type="text" id="password' + user.UserID  + '" value="' + user.PasswordHash + '"/></td>'
					+'</tr>'
					+'<tr>'
						+'<td>Role: </td>'
						+'<td><input type="text" id="role' + user.UserID  + '" value="' + user.Role + '"/></td>'
					+'</tr>'
					+'<tr>'
						+'<td>User Name: </td>'
						+'<td><input type="text" id="userName' + user.UserID  + '" value="' + user.Username + '"/></td>'
					+'</tr>'
				+'</table>'
				+'<input type=button class="submitUserChanges" value="Submit"/><input type=button class="deleteUser" value="Delete"/><br />'				
		+'</div>');
			
}
	

function submitEmployeeChanges(userID){
	alert(userID);
	var fName = $('#fName'+userID).val();
	var lName = $('#lName'+userID).val();
	var pass = $('#password'+userID).val();
	var role = $('#role'+userID).val();
	var userName = $('#userName'+userID).val();
	var queryString = "FName="+fName+"&LName="+lName+"&PasswordHash="+pass+"&Role="+role+"&Username="+userName;
	alert(queryString);
	request("user", userID, RequestType.UPDATE, userInfo, queryString, usersScreen, userErrorFunction);
}

function addNewEmployee(){
	var first = $('#newUserFirstName').val();
	var last = $('#newUserLastName').val();
	var pass = $('#newUserPassword').val();
	var role = $('#newUserRole').val();
	var userName = $('#newUserName').val();

	request("user", "", RequestType.CREATE, userInfo, "FName="+first+"&LName="+last+"&PasswordHash="+pass+"&Role="+role+"&Username="+userName, usersScreen);
}

function addClickEvents(){
	
	// Add click function to buttons
	$('.submitUserChanges').click(function() {
		var userID = $(this).closest('.user').find('.userID').val();
		submitEmployeeChanges(userID);
	});
	
	// Add click function to buttons
	$('.deleteUser').click(function() {
		alert(".deleteUser");
		var userID = $(this).closest('.user').find('.userID').val();
		alert(userID);
		request("user", userID, RequestType.DELETE, userInfo, "UserID="+userID, usersScreen, userErrorFunction);		
	});
	
	//Add click function to button
	$('#addEmployee').click(function() {
		addNewEmployee();
	});
}


function userErrorFunction(){
	alert("Users error function called");
}

