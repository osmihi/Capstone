//Called to render Menu Item screen
function menuItemScreen() {
	// API call: request(resource, key, rqType, userInfoString, dataString,
	// successFunc, errorFunc)
	request("menuItem", "", RequestType.READ, userInfo, "", buildMenuItemScreen);
}

// response is result of API request call
function buildMenuItemScreen(response) {
	
	var items = response.data;


	// Wipe page clean (remove previous existing content)
	$('#page').html("");

	
	
	// Iterate through menuItems, call menu items
	for (i = 0; i < items.length; i++) {
		drawItems(items[i]);
	}
}




// Creates box containing menu items
function drawItems(menuItem) {
	// Add div with menu items page div
	$('#page').append(
			'<div id="menu' + menuItem.MenuItemtID + '" class="menuItem">'
				+'<table>'
					+'<tr>' 
						+'<td>Item Name: </td>'
						+'<td><input type="text" id="menuItemName" value="'+ menuItem.Name +'"/></td>'
					+'</tr>'
					+'<tr>'
						+'<td>Item Category: </td>'
						+'<td><input type="text" id="menuItemCategory" value="'+ menuItem.Category +'"/></td>'
					+'</tr>'
					+'<tr>'
						+'<td>Item Prep Time: </td>'
						+'<td><input type="text" id="menuItemPrepTime" value="'+ menuItem.PrepTime +'"/></td>'
					+'</tr>'
					+'<tr>'
						+'<td>Item Price: </td>'
						+'<td><input type="text" id="menuItemPrice" value="'+ menuItem.Price +'"/></td>'
					+'</tr>'
					+'</table>'
					+'<input type=button id="submitItemChanges" value="Submit"/><br />'
					+'<input type=button id="backToMenuList" value="Back"/><br />'
					+
							
			'</div>');
	
	
	
	
	
	// Add click function to buttons
	$('#submitItemChanges'+ menuItem.MenuItemtID ).click(function() {
		SubmitMenuItemChanges(menuItem);
	});
		
	$('#backToMenuList').click(function() {
		menuScreen();
	});
}
	

function SubmitMenuItemChanges(){
		var itemName = $('#menuItemName').val();
		var itemCategory = $('#menuItemCategory').val();
		var itemPrepTime = $('#menuItemPrepTime').val();
		var itemPrice = $('#menuItemPrice').val();
		
		request("menuItem", "", RequestType.UPDATE, userInfo, "Name="+itemName+"&Category="+itemCategory+"&PrepTime="+itemPrepTime+"&Price="+itemPrice, menuScreen);
}

