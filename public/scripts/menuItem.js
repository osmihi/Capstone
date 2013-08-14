//Called to render Menu Item screen
function menuScreen() {
	$('.navButton').css("font-weight", "normal");
	$('.menuScreen').css("font-weight", "bold");
	
	refreshFunc = function() {};
	
	// API call: request(resource, key, rqType, userInfoString, dataString,
	// successFunc, errorFunc)
	request("menuItem", "", RequestType.READ, userInfo, "", buildMenuItemScreen);
}

// response is result of API request call
function buildMenuItemScreen(response) {
	var items = response.data;
	$('#page').html("");
	
	drawAddMenuItem();
	
	if(items == null){
		$('#page').append("<h2>There are no menu items currently in the system.");
	}
	else{
		items.sort(function(objA, objB) {
			var nameA=objA.Name.toLowerCase();
			var nameB=objB.Name.toLowerCase();
			if (nameA < nameB)
				return -1;
			else if (nameA > nameB)
				return 1;
			else return 0;
		});

		// Iterate through menuItems, call menu items
		for (i = 0; i < items.length; i++) {
			drawItems(items[i]);
		}
	
	}

}

	
function drawAddMenuItem() {
	//Add a div with inputs to enter a new MENU ITEM
	$('#page').append(
		'<div id="addMenuItem" class="formButton menuItem addMenuItem">'
			+'<input type=button id="addMenuItemSubmit" class="formButton submitItemChanges addMenuItemSubmit" value="Add"/>'
			+'<div class="inputLabel employeeLabel">Name </div>'
			+'<input type="text" id="itemName" class="inputField menuItemName"/>' + '<br />'
			+'<div class="inputLabel employeeLabel">Category </div>'
			+ '<select id="itemCategory" class="inputField menuItemCategory">'
				+ '<option value="Beverage">Beverage</option>'
				+ '<option value="Appetizer">Appetizer</option>'
				+ '<option value="Main Course">Main Course</option>'
				+ '<option value="Dessert">Dessert</option>'
			+ '</select>' + '<br />'
			+'<div class="inputLabel employeeLabel">Prep Time </div>'
			+'<input type="text" id="itemPrepTime" class="inputField menuItemPrepTime" value=""/>' + '<br />'
			+'<div class="inputLabel employeeLabel">Price </div>'
			+'<input type="text" id="itemPrice" class="inputField menuItemPrice" value=""/>' + '<br />'
		+'</div>'
	);

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
	if(name == "" || name == null){
		alert("Name cannot be empty");
	}
	else if(!isNumber(prepTime) || !isNumber(price)){
		alert("Prep time and price must be numbers")
	}
	else if(prepTime < 1 || prepTime > 201){
		alert("Prep time must be between 1 and 200 minutes");
	}
	else{
		request("menuItem", "", RequestType.CREATE, userInfo, "Name="+name+"&Category="+category+"&PrepTime="+prepTime+"&Price="+price, menuScreen);
	}
}

// Creates box containing menu items
function drawItems(menuItem) {
	// Add div with menu items page div
	$('#page').append(
		'<div id="menu' + menuItem.MenuItemID + '" class="formButton menuItem">'
			+'<input type=button id="submitItemChanges' + menuItem.MenuItemID + '" class="formButton submitItemChanges" value="Submit"/>'
			+'<input type=button id="deleteMenuItem' + menuItem.MenuItemID + '" class="formButton deleteMenuItem" value="Delete"/>'
			+'<div class="inputLabel employeeLabel">Name </div>'
			+'<input type="text" id="menuItem' + menuItem.MenuItemID + 'Name" class="inputField menuItemName" value="'+ menuItem.Name +'"/>' + '<br />'
			+'<div class="inputLabel employeeLabel">Category </div>'
			+ '<select id="menuItem' + menuItem.MenuItemID + 'Category" class="inputField menuItemCategory">'
				+ '<option value="Beverage">Beverage</option>'
				+ '<option value="Appetizer">Appetizer</option>'
				+ '<option value="Main Course">Main Course</option>'
				+ '<option value="Dessert">Dessert</option>'
			+ '</select>' + '<br />'
			+'<div class="inputLabel employeeLabel">Prep Time </div>'
			+'<input type="text" id="menuItem' + menuItem.MenuItemID + 'PrepTime" class="inputField menuItemPrepTime" value="'+ menuItem.PrepTime +'"/>' + '<br />'
			+'<div class="inputLabel employeeLabel">Price </div>'
			+'<input type="text" id="menuItem' + menuItem.MenuItemID + 'Price" class="inputField menuItemPrice" value="'+ menuItem.Price +'"/>' + '<br />'
		+'</div>'
	);

	$('#menuItem' + menuItem.MenuItemID + 'Category').val(menuItem.Category);

	// Add click function to buttons
	$('#submitItemChanges'+ menuItem.MenuItemID ).click(function() {
		SubmitMenuItemChanges(menuItem.MenuItemID);
	});
		
	$('#deleteMenuItem' + menuItem.MenuItemID).click(function() {
		var isSure = confirm("Are you sure you want to delete this menu item?");
		if(isSure){
			request("menuItem", menuItem.MenuItemID, RequestType.DELETE, userInfo, "", menuScreen);
		}
	});
}
	

function SubmitMenuItemChanges(menuItemID) {
		var itemName = $('#menuItem' + menuItemID + 'Name').val();
		var itemCategory = $('#menuItem' + menuItemID + 'Category').val();
		var itemPrepTime = $('#menuItem' + menuItemID + 'PrepTime').val();
		var itemPrice = $('#menuItem' + menuItemID + 'Price').val();
		if(itemName == "" || itemName == null){
			alert("Name cannot be empty");
		}
		else if(!isNumber(itemPrepTime) || !isNumber(itemPrice)){
			alert("Prep time and price must be numbers")
		}
		else if(prepTime < 1 || prepTime > 201){
			alert("Prep time must be between 1 and 200 minutes");
		}
		else{
			request("menuItem", menuItemID, RequestType.UPDATE, userInfo, "Name="+itemName+"&Category="+itemCategory+"&PrepTime="+itemPrepTime+"&Price="+itemPrice, menuScreen);		
		}
}

