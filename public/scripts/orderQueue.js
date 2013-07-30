//Global variables
var orderQueueOrders;
var orderQueueOrderItems;
var orderQueueMenuItems;

// request for all orders
function orderQueueScreen() {
	// API call: request(resource, key, rqType, userInfoString, dataString,
	// successFunc, errorFunc)
	request("order", "", RequestType.READ, userInfo, "",
			populateOrderQueueOrders);
	// request("order", "", RequestType.READ, userInfo, "",
	// buildOrderQueueScreen);
}

function populateOrderQueueOrders(response) {
	orderQueueOrders = response.data;
	// for(var i=0; i < orderQueueOrders.length; i++){
	// alert(orderQueueOrders[i].OrderID);
	// }
	request("orderItem", "", RequestType.READ, userInfo, "",
			populateOrderQueueOrderItems);
}

function populateOrderQueueOrderItems(response) {
	orderQueueOrderItems = response.data;
	// for(var i=0; i < orderQueueOrderItems.length; i++){
	// alert(orderQueueOrderItems[i].OrderItemID);
	// }
	request("menuItem", "", RequestType.READ, userInfo, "",
			populateOrderQueueMenuItems);
}

function populateOrderQueueMenuItems(response) {
	orderQueueMenuItems = response.data;
	buildOrderQueueScreen();
}

function buildOrderQueueScreen() {
	addMenuInfoToOrderItems();
	addOrderItemsToOrders();
	sortOrdersAndItems();
	
	//Clear page
	$('#page').html("");
	
	//Draw orderQueue
	for(var i=0; i < orderQueueOrders.length; i++){
		drawOrder(orderQueueOrders[i]);
	}

//	
//
//	$('#page').html("");
//	alert("3");
//	for (i = 0; i < orders.length; i++) {
//		drawOrderHeading(orders[i]);
//		request("orderItem", "", RequestType.READ, userInfo, "",
//				populateOrderQueueOrderItems);
//	}
//	request("table", "", RequestType.READ, userInfo, "", fillInTableNumbers);
//
//	request("menuItem", "", RequestType.READ, userInfo, "", drawMenuItemInfo);
//	request("menuItem", "", RequestType.READ, userInfo, "", addClickEvents);

}

//4
function drawOrder(order){
	drawOrderDiv(order);
	//drawOrderItems(order)
}

//5
function drawOrderDiv(order) {
	// alert("drawOrderHeading");
	var tableString = $.isNumeric(order.TableID) ? order.TableID : "None";
	var orderHeadingString = '<div id="order' + order.OrderID
			+ '" class="order">' + '<div class="orderHeading">'
			+ '<div class="orderHeadingInfo">'
			+ 'Table #<span class="orderTableID">' + tableString + '</span>'
			+ '</div>' + '<div class="orderHeadingInfo">' + 'Placed: '
			+ order.Timestamp + '</div>' + '</div>' + '</div>';
	$('#page').append(orderHeadingString)
}

function drawOrderItems(order) {
	var orderItems = order.orderItems;
//	ITERATE THROUGH ORDER ITEMS
//	for (i = 0; i < orderItems.length; i++) {
	//var orderItemString = 
//	ORDER ITEM DIV
//			'<div id="orderItem' + orderItems[i].OrderItemID + '" class="orderItem orderItemStatus' + orderItems[i].Status + '">'
//	HIDDEN INPUT FOR ORDER ITEM ID
//				+ '<input type="hidden" class="orderItemIdHolder" value="'+ orderItems[i].OrderItemID+'"/>' 
//	ORDER ITEM INFO DIV -> STATUS
//			if (orderItems[i].Status = "Ready")
//			orderItemString += 'Ready';
//		else if (orderItems[i].Status; == "InPrep")
//			orderItemString += 'In Prep';
//		else
//			orderItemString += 'New';
//		orderItemString += '</div>';
//	ORDER ITEM INFO DIV -> NAME
//	ORDER ITEM INFO DIV -> CATEGORY
//	ORDER ITEM INFO DIV -> PREP TIME
//  ADD TO ORDER DIV
//		var orderDivId = '#order' + orderItems[i].OrderID;
//		$(orderDivId).append(orderItemString);
//	}

}

//1
function addMenuInfoToOrderItems() {
	for ( var i = 0; i < orderQueueOrderItems.length; i++) {
//		alert("i=" + i);
		for ( var j = 0; j < orderQueueMenuItems.length; j++) {
			if (orderQueueOrderItems[i].MenuItemID == orderQueueMenuItems[j].MenuItemID) {
//				alert(orderQueueMenuItems[j].Name);
				orderQueueOrderItems[i].Name = orderQueueMenuItems[j].Name;
				orderQueueOrderItems[i].PrepTime = orderQueueMenuItems[j].PrepTime;
				orderQueueOrderItems[i].Category = orderQueueMenuItems[j].Category;
			}
		}
	}
}

//2
function addOrderItemsToOrders() {
	for ( var i = 0; i < orderQueueOrders.length; i++) {
//		alert("i=" + i);
		var count = 0;
		var orderItemsArray = [];
		for ( var j = 0; j < orderQueueOrderItems.length; j++) {
			if (orderQueueOrderItems[j].OrderID == orderQueueOrders[i].OrderID) {
				// alert(orderQueueOrderItems[j].OrderID + " == "
				// + orderQueueOrders[i].OrderID);
				orderItemsArray[count++] = orderQueueOrderItems[j];
			}
		}
		orderQueueOrders[i].orderItems = orderItemsArray;
		for ( var k = 0; k < orderQueueOrders[i].orderItems.length; k++) {
//			alert(orderQueueOrders[i].orderItems[k].Name);
		}
	}
}

//3
function sortOrdersAndItems(){
	//Sort orders
	orderQueueOrders.sort(function(objA, objB) {
		if (objA.Timestamp < objB.Timestamp)
			return -1;
		else
			return 1;
	});
	
	//Sort orderItems
	for(var i=0; i<orderQueueOrders.length; i++){
		orderQueueOrders[i].orderItems.sort(function(objA, objB) {
			if (objA.PrepTime > objB.PrepTime)
				return -1;
			else
				return 1;
		});
	//Test
		for(var j=0; j<orderQueueOrders[i].orderItems.length; j++){
		alert(i + ": " + orderQueueOrders[i].orderItems[j].Name + ", Prep = " + orderQueueOrders[i].orderItems[j].PrepTime);
		}
	}
}

function fillInTableNumbers(response) {
	// alert("fillInTableNumbers");
	$('.orderTableID').each(function() {
		for (i = 0; i < response.data.length; i++) {
			if (this.innerHTML == response.data[i].TableID) {
				this.innerHTML = response.data[i].Number;
			}
		}
	});
}

// if (menuItems[j].MenuItemID == orderItems[i].MenuItemID) {
// alert(orderQueueMenuItems[j].Name);
// orderItems[i].Name = menuItems[j].Name;
// orderItems[i].PrepTime = menuItems[j].PrepTime;
// }
// }
// }
// request("orderItem", "", RequestType.READ, userInfo, "OrderID="+
// orders[i].OrderID, drawOrderItems);

//function buildOrderQueueScreen(response) {
//	// alert("buildOrderQueueScreen(response)");
//	var orders = response.data;
//	alert("2");
//	orders.sort(function(objA, objB) {
//		if (objA.Timestamp < objB.Timestamp)
//			return -1;
//		else
//			return 1;
//	});
//
//	$('#page').html("");
//	alert("3");
//	for (i = 0; i < orders.length; i++) {
//		drawOrderHeading(orders[i]);
//		request("orderItem", "", RequestType.READ, userInfo, "",
//				populateOrderQueueOrderItems);
//	}
//	request("table", "", RequestType.READ, userInfo, "", fillInTableNumbers);
//
//	request("menuItem", "", RequestType.READ, userInfo, "", drawMenuItemInfo);
//	request("menuItem", "", RequestType.READ, userInfo, "", addClickEvents);
//
//}

// ====================================================================================================================

//function drawOrderHeading(order) {
//	// alert("drawOrderHeading");
//	var tableString = $.isNumeric(order.TableID) ? order.TableID : "None";
//	var orderHeadingString = '<div id="order' + order.OrderID
//			+ '" class="order">' + '<div class="orderHeading">'
//			+ '<div class="orderHeadingInfo">'
//			+ 'Table #<span class="orderTableID">' + tableString + '</span>'
//			+ '</div>' + '<div class="orderHeadingInfo">' + 'Placed: '
//			+ order.Timestamp + '</div>' + '</div>' + '</div>';
//	$('#page').append(orderHeadingString)
//}



//function drawOrderItems(response) {
//	// alert("drawOrderItems");
//	// alert("response.data[0].OrderItemID: " + response.data[0].OrderItemID);
//	var orderItems = response.data;
//
//	// alert("orderItems.length ="+ orderItems.length)
//	for (i = 0; i < orderItems.length; i++) {
//		var orderItemStatus = orderItems[i].Status;
//		var orderItemString = '<div id="orderItem' + orderItems[i].OrderID
//				+ '" class="orderItem orderItemStatus' + orderItems[i].Status
//				+ '">'
//				+ '<input type="hidden" class="orderItemIdHolder" value="'
//				+ orderItems[i].OrderItemID + '"/>' + '<div class="menuItemID'
//				+ orderItems[i].MenuItemID + '"></div>'
//				+ '<div class="statusDiv">Status: ';
//		if (orderItemStatus == "Ready")
//			orderItemString += 'Ready';
//		else if (orderItemStatus == "InPrep")
//			orderItemString += 'In Prep';
//		else
//			orderItemString += 'New';
//		orderItemString += '</div>';
//		var orderDivId = '#order' + orderItems[i].OrderID;
//		$(orderDivId).append(orderItemString);
//	}
//	// Add click functions
//}

function drawMenuItemInfo(response) {
	// alert("drawMenuItemInfo");
	var menuItems = response.data;
	for (i = 0; i < menuItems.length; i++) {
		var menuItemDivClass = '.menuItemID' + menuItems[i].MenuItemID;
		if ($(menuItemDivClass).length > 0) {
			var menuItemInfo = '<div class="menuItemInfo">'
					+ '<div class="menuItemInfoSnippet">' + menuItems[i].Name
					+ '</div>' + '<div class="menuItemInfoSnippet">'
					+ menuItems[i].Category + '</div>'
					+ '<div class="menuItemInfoSnippet">' + 'Prep time: '
					+ menuItems[i].PrepTime + ' min' + '</div>' + '</div>';
			// alert("menuItemInfo = " + menuItemInfo);

			$(menuItemDivClass).append(menuItemInfo);
		}
	}
}

function addClickEvents() {
	$('.orderItem').click(function() {
		var orderItemId = $(this).find(".orderItemIdHolder").val();
		// alert("orderItemId = " + orderItemId);
		getOrderItemForStatusUpdate(orderItemId);
	});
}

function getOrderItemForStatusUpdate(orderItemId) {
	// alert("getOrderItemForStatusUpdate");
	request("orderItem", orderItemId, RequestType.READ, userInfo, "",
			setOrderItemStatus);
}

function setOrderItemStatus(response) {
	var orderItem = response.data[0];
	var currentStatus = orderItem.Status;
	var newStatus = "InPrep";
	if (currentStatus == "InPrep") {
		newStatus = "Ready";
	} else if (currentStatus == "Ready") {
		return;
	}
	request("orderItem", orderItem.OrderItemID, RequestType.UPDATE, userInfo,
			"Status=" + newStatus, orderQueueScreen);

}

// for each order, get the orderItems for each
// sort the order items by longest prep time first

// create a listing of the order items inside each order
// (draw a div for each order, and inside of it put
// a div for each orderItem)

// set a click handler to change the orderItem's status to:
// prep, if it's waiting
// ready, if it's in prep

// if all the orderItems in an order are ready, then remove the order from the
// screen
// but if only some are, display the "ready" ones a different color or something

// maybe color-code orders or alternate?

