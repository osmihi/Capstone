// draw the nav bar
// put buttons in it depending on role
// each button will display a screen

var NavButtons = new Array();
NavButtons['Manager'] = ["waitListScreen", "seatingScreen", "orderQueueScreen", "usersScreen", "tablesScreen", "discountsScreen", "menuScreen","menuItemScreen"];
NavButtons['Host'] = ["waitListScreen", "seatingScreen"];
NavButtons['Wait Staff'] = ["tablesScreen"];
NavButtons['Kitchen Staff'] = ["orderQueueScreen"];

var ScreenNames = new Array();
ScreenNames["waitListScreen"] = 'Wait List';
ScreenNames["seatingScreen"] = 'Seating';
ScreenNames["orderQueueScreen"] = 'Kitchen';
ScreenNames["usersScreen"] = 'Employees';
ScreenNames["tablesScreen"] = 'Tables';
ScreenNames["discountsScreen"] = 'Discounts';
ScreenNames["menuScreen"] = 'Menu';
ScreenNames["menuItemScreen"] = 'Menu Item';

function navBar() {
	// get the info necessary to make the nav bar and call build function
	if (userID != '' && userInfo != '') request("user", userID, RequestType.READ, userInfo, "", buildNavBar);
	else buildLogin();
}

function buildLogin() {
	//Wipe page clean (remove previous existing content)
	$('#header').html("");

	$('#header').append(
		'<form id="loginForm" action="javascript:void(0);">' +
			'<label for="username">Username </label>' +
			'<input type="text" id="username" name="username">' + '</input>' + '<br />' +
			'<label for="password">Password </label>' +
			'<input type="password" id="password" name="password">' + '</input>' + '<br />' +	
			'<input id="loginSubmit" type="submit" value="Log In">' + '<br />' +
			'<span id="loginMessage"></span>' +
		'</form>');
	
	$('#loginSubmit').click(function() {
		var uName = $("#username").val();
		var uPass = $("#password").val();

		$.ajax({
			url : "http://www.ordrupapp.com/login",
			type : "POST",
			data : "auth_Username=" + uName + "&" + "auth_Password=" + uPass,
			error : function(response, textStatus, errorThrown) {
				$('#loginMessage').html('Login failed.');
			},
			success : function(response) {
				window.location.href = "http://www.ordrupapp.com/";
			}
		});
	});
}

function buildNavBar(response) {
	//Wipe page clean (remove previous existing content)
	$('#header').html("");
	
	// draw the elements in the nav bar, calling any subfunctions to make elements
	
	var fName = response.data[0].FName;
	var lName = response.data[0].LName;
	var role = response.data[0].Role;

	drawUserInfo(fName, lName, role);
	
	// make a button/link for each page they have access to
	for (i = 0; i < NavButtons[role].length; i++) {
		$('#header').append(
			makeNavButton(NavButtons[role][i])
		);
	}
}

function drawUserInfo(fName, lName, role) {
	$('#header').append(
		'<div id="userInfo" class="userInfoBox">' +
			'<div class="userFullName">' + fName + ' ' + lName + '</div>' +
			'<div class="userRole">' + role + '</div>' +
			'<input id="logoutSubmit" type="submit" value="Log Out">' + '<br />' +
		'</div>');
	
	$('#logoutSubmit').click(function() {
		$.ajax({
			url : "http://www.ordrupapp.com/logout",
			type : "GET",
			error : function(response, textStatus, errorThrown) {
				window.location.href = "http://www.ordrupapp.com/";
			},
			success : function(response) {
				window.location.href = "http://www.ordrupapp.com/";
			}
		});
	});
}

function makeNavButton(screenName) {
	return $(
		'<div class="navButton ' + screenName + '"><a>' +
			ScreenNames[screenName] +
		'</a></div>'
	).click(function() {
		window[screenName]();
	});
}
