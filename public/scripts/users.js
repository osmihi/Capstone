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
	request("user", "", RequestType.READ, userInfo, "", buildUsersScreen);
}

// response is result of API request call
function buildUsersScreen(response) {
	
	var employees = response.data;


	// Wipe page clean (remove previous existing content)
	$('#page').html("");
	
	drawAddEmployees()
	
	
	
	// Iterate through USERS, call EMPLOYEES
	for (i = 0; i < employees.length; i++) {
		drawEmployees(employees[i]);
	}
}

function drawAddEmployees() {
	
	
	
	
	
	//Add a div with inputs to enter a new MENU ITEM
	$('#page').append(
			'<div id="addEmployee" class="addEmployee">'
			+'<table>'
				+'<tr>' 
					+'<td>First Name: </td>'
					+'<td><input type="text" id="fName" value=""/></td>'
				+'</tr>'
				+'<tr>'
					+'<td>Last Name: </td>'
					+'<td><input type="text" id="lName" value=""/></td>'
				+'</tr>'
				+'<tr>'
					+'<td>Password: </td>'
					+'<td><input type="text" id="password" value=""/></td>'
				+'</tr>'
				+'<tr>'
					+'<td>Role: </td>'
					+'<td><select id="role"><value="<option></option><option>Host</option><option>Kitchen Staff</option><option>Wait Staff</option><option>Manager</option>"</select></td>'
				+'</tr>'
				+'<tr>'
					+'<td>User Name: </td>'
					+'<td><input type="text" id="userName" value=""/></td>'
			+'</tr>'
			+'</table>'
			
			+'<input type=button id="addEmployee" value="Add Employee"/><br />'
			+
						
		'</div>');
	//Add click function to button
	$('#addEmployee').click(function() {
		addNewEmployee();
	});
}

function addNewEmployee(){
	var first = $('#fName').val();
	var last = $('#lName').val();
	var pass = $('#password').val();
	var role = $('#role').val();
	var users = $('#userName').val();

	request("user", "", RequestType.CREATE, userInfo, "FName="+first+"&LName="+last+"&PasswordHash="+pass+"&Role="+role+"&Username="+users, usersScreen);
}






// Creates box containing menu items
function drawEmployees(user) {
	// Add div with menu items page div
	$('#page').append(
			'<div id="employeeList' + user.UserID + '" class="employeeList">'
			+'<table>'
				+'<tr>' 
					+'<td>First Name: </td>'
					+'<td><input type="text" id="fName" value="' + user.FName + '"/></td>'
				+'</tr>'
				+'<tr>'
					+'<td>Last Name: </td>'
					+'<td><input type="text" id="lName" value="' + user.LName + '"/></td>'
				+'</tr>'
				+'<tr>'
					+'<td>Password: </td>'
					+'<td><input type="text" id="password" value="' + user.PasswordHash + '"/></td>'
				+'</tr>'
				+'<tr>'
					+'<td>Role: </td>'
					+'<td><input type="text" id="role" value="' + user.Role + '"/></td>'
				+'</tr>'
				+'<tr>'
					+'<td>User Name: </td>'
					+'<td><input type="text" id="userName" value="' + user.Username + '"/></td>'
			+'</tr>'
			+'</table>'
					+'<input type=button id="submitChanges" value="Submit"/><br />'
					+
							
			'</div>');
	
	
	// Add click function to buttons
	$('#submitChanges'+ user.UserID  ).click(function() {
		SubmitEmployeeChanges(menuItem);
	});
	
}
	

function SubmitEmployeeChanges(){
	var first = $('#fName').val();
	var last = $('#lName').val();
	var pass = $('#password').val();
	var role = $('#role').val();
	var users = $('#userName').val();

	request("user", "", RequestType.UPDATE, userInfo, "FName="+first+"&LName="+last+"&PasswordHash="+pass+"&Role="+role+"&Username="+users, employeeScreen);
}


