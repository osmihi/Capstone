//Called to render Menu Item screen
function menuScreen() {
	
	refreshFunc = function() {};
	
	// API call: request(resource, key, rqType, userInfoString, dataString,
	// successFunc, errorFunc)
	request("menuItem", "", RequestType.READ, userInfo, "", buildMenuItemScreen);
}

// response is result of API request call
function buildMenuItemScreen(response) {
	
	var items = response.data;

	items.sort(function(objA, objB) {
		var nameA=objA.Name.toLowerCase();
		var nameB=objB.Name.toLowerCase();
		if (nameA < nameB)
			return -1;
		else if (nameA > nameB)
			return 1;
		else return 0;
	});

	// Wipe page clean (remove previous existing content)
	$('#page').html("");
	
	drawAddMenuItem();

	// Iterate through menuItems, call menu items
	for (i = 0; i < items.length; i++) {
		drawItems(items[i]);
	}
}

function drawAddMenuItem() {
	//Add a div with inputs to enter a new MENU ITEM
	$('#page').append(
			'<div id="addMenuItem" class="addMenuItem">'
			+'<table>'
				+'<tr>' 
					+'<td>Item Name: </td>'
					+'<td><input type="text" id="itemName" value=""/></td>'
				+'</tr>'
				+'<tr>'
					+'<td>Item Category: </td>'
					+ '<td>'
					+ '<select id="itemCategory" class="menuItemCategory">'
						+ '<option value="Appetizer">Appetizer</option>'
						+ '<option value="Main Course">Main Course</option>'
						+ '<option value="Dessert">Dessert</option>'
					+ '</select>'
					+ '</td>'
				+'</tr>'
				+'<tr>'
					+'<td>Item Prep Time: </td>'
					+'<td><input type="text" id="itemPrepTime" value=""/></td>'
				+'</tr>'
				+'<tr>'
					+'<td>Item Price: </td>'
					+'<td><input type="text" id="itemPrice" value=""/></td>'
				+'</tr>'
			+'</table>'
			
			+'<input type="button" id="addMenuItemSubmit" value="Add"/><br />'
			+
						
		'</div>');
	//Add click function to button
	$('#addMenuItemSubmit').click(function() {
		addItemToMenu();
	});
}

function addItemToMenu(){
	var name = $('#itemName').val();
	var category = $('#itemCategory').val();
	var prepTime = $('#itemPrepTime').val();
	var price = $('#itemPrice').val();
	
	request("menuItem", "", RequestType.CREATE, userInfo, "Name="+name+"&Category="+category+"&PrepTime="+prepTime+"&Price="+price, menuScreen);
}



// Creates box containing menu items
function drawItems(menuItem) {
	// Add div with menu items page div
	$('#page').append(
			'<div id="menu' + menuItem.MenuItemID + '" class="menuItem">'
				+'<table>'
					+'<tr>' 
						+'<td>Item Name: </td>'
						+'<td><input type="text" id="menuItem' + menuItem.MenuItemID + 'Name" class="menuItemName" value="'+ menuItem.Name +'"/></td>'
					+'</tr>'
					+'<tr>'
						+'<td>Item Category: </td>'
						+ '<td>'
							+ '<select id="menuItem' + menuItem.MenuItemID + 'Category" class="menuItemCategory">'
								+ '<option value="Appetizer">Appetizer</option>'
								+ '<option value="Main Course">Main Course</option>'
								+ '<option value="Dessert">Dessert</option>'
							+ '</select>'
						+ '</td>'
					+'</tr>'
					+'<tr>'
						+'<td>Item Prep Time: </td>'
						+'<td><input type="text" id="menuItem' + menuItem.MenuItemID + 'PrepTime" class="menuItemPrepTime" value="'+ menuItem.PrepTime +'"/></td>'
					+'</tr>'
					+'<tr>'
						+'<td>Item Price: </td>'
						+'<td><input type="text" id="menuItem' + menuItem.MenuItemID + 'Price" class="menuItemPrice" value="'+ menuItem.Price +'"/></td>'
					+'</tr>'
					+'</table>'
					+'<input type=button id="submitItemChanges' + menuItem.MenuItemID + '" value="Submit"/><br />'
					+'<input type=button id="deleteMenuItem' + menuItem.MenuItemID + '" value="Delete"/><br />'
					+
							
			'</div>');

	$('#menuItem' + menuItem.MenuItemID + 'Category').val(menuItem.Category);

	// Add click function to buttons
	$('#submitItemChanges'+ menuItem.MenuItemID ).click(function() {
		SubmitMenuItemChanges(menuItem.MenuItemID);
	});
		
	$('#deleteMenuItem' + menuItem.MenuItemID).click(function() {
		request("menuItem", menuItem.MenuItemID, RequestType.DELETE, userInfo, "", menuScreen);
	});
}
	

function SubmitMenuItemChanges(menuItemID) {
		var itemName = $('#menuItem' + menuItemID + 'Name').val();
		var itemCategory = $('#menuItem' + menuItemID + 'Category').val();
		var itemPrepTime = $('#menuItem' + menuItemID + 'PrepTime').val();
		var itemPrice = $('#menuItem' + menuItemID + 'Price').val();
		
		request("menuItem", menuItemID, RequestType.UPDATE, userInfo, "Name="+itemName+"&Category="+itemCategory+"&PrepTime="+itemPrepTime+"&Price="+itemPrice, menuScreen);
}

