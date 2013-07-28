//Called to render MenuItem screen
function menuScreen() {
  // API call: request(resource, key, rqType, userInfoString, dataString,
	// successFunc, errorFunc)
	request("menuItem", "", RequestType.READ, userInfo, "", buildMenuScreen);
}

// response is result of API request call
function buildMenuScreen(response) {
	
	var menuItems = response.data;


	// Wipe page clean (remove previous existing content)
	$('#page').html("");

	
	
	// Iterate through menuItems, call menu items
	for (i = 0; i < menuItems.length; i++) {
		drawMenuItems(menuItems[i]);
	}
}




// Creates box containing menu items
function drawMenuItems(menuItem) {
	// Add div with menu items page div
	$('#page').append(
			
			'<div id="menu' + menuItem.MenuItemtID + '" class="menuItem">'
					+ 'Name: ' + menuItem.Name + '<br />' 
					+ 'Category: ' + menuItem.Category + '<br />' 
					+ 'Prep Time: ' + menuItem.PrepTime + '<br />'
					+ 'Price ' + menuItem.Price + '<br />'+
					
			'</div>'
					+'<input type=button id="editMenuItem" value="Edit Menu Item"/><br />'
			);
	// Add click function to button
		$('#editMenuItem' + menuItem.MenuItemtID).click(function() {
			menuItemScreen(menuItem);
	});

}
