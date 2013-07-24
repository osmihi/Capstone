// draw the nav bar
// put buttons in it depending on role
// each button will display a screen

NavButtons = new Array();

NavButtons['Manager'] = ["waitListScreen", "seatingScreen", "orderQueueScreen", "usersScreen", "tablesScreen", "discountsScreen", "menuScreen"];
NavButtons['Host'] = ["waitListScreen", "seatingScreen"];
NavButtons['Wait Staff'] = ["tablesScreen"];
NavButtons['Kitchen Staff'] = ["orderQueueScreen"];

ScreenNames = new Array();

ScreenNames["waitListScreen"] = 'Wait List';
ScreenNames["seatingScreen"] = 'Seating';
ScreenNames["orderQueueScreen"] = 'Kitchen';
ScreenNames["usersScreen"] = 'Employees';
ScreenNames["tablesScreen"] = 'Tables';
ScreenNames["discountsScreen"] = 'Discounts';
ScreenNames["menuScreen"] = 'Menu';

function navBar() {
	// get the info necessary to make the nav bar and call build function
	request("user", userID, RequestType.READ, userInfo, "", buildNavBar);
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
		'</div>');
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