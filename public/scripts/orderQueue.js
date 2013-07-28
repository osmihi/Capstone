// request for all orders
function orderQueueScreen() {
	// API call: request(resource, key, rqType, userInfoString, dataString, successFunc, errorFunc)
	request("order", "", RequestType.READ, userInfo, "", buildOrderQueueScreen);
}


function buildOrderQueueScreen(response){
	//alert("buildOrderQueueScreen(response)");
	var orders = response.data;
	
	orders.sort(function(objA, objB) {
		if (objA.Timestamp < objB.Timestamp)
			return -1;
		else
			return 1;
	});
	
	$('#page').html("");
	
	for (i = 0; i < orders.length; i++) {
		drawOrderHeading(orders[i]);	
		request("orderItem", "", RequestType.READ, userInfo, "OrderID="+ orders[i].OrderID, drawOrderItems);
	}
	request("table", "", RequestType.READ, userInfo, "", fillInTableNumbers);
	request("menuItem", "", RequestType.READ, userInfo, "", drawMenuItemInfo);
}

//function drawOrderDiv(order){
//	drawOrderHeading(order);
//	//alert("drawOrderDiv: order.OrderID = "+ order.OrderID);
//	request("orderItem", "", RequestType.READ, userInfo, "OrderID="+ order.OrderID, drawOrderItems, alert("failure in drawOrderDiv"));
//	//$('#page').append('</div>');
//}


function drawOrderHeading(order){
	//alert("drawOrderHeading");
	var tableString = $.isNumeric(order.TableID) ? order.TableID : "None";
	var orderHeadingString =
		'<div id="order'+order.OrderID+'" class="order">' +
			'<div class="orderHeading">' +
				'<div class="orderHeadingInfo">' +
					'Table #<span class="orderTableID">' + tableString + '</span>' +
				'</div>' + 
				'<div class="orderHeadingInfo">' +
					'Placed: ' + order.Timestamp +
				'</div>' +
			'</div>' +
		'</div>';
	$('#page').append(orderHeadingString)
}

function fillInTableNumbers(response){
	//alert("fillInTableNumbers");
	$('.orderTableID').each(function () {
		for (i = 0; i < response.data.length; i++) {
			if ( this.innerHTML == response.data[i].TableID ) {
				this.innerHTML = response.data[i].Number; 
			}
		}
	});
}


function drawOrderItems(response){
	//alert("drawOrderItems");
	//alert("response.data[0].OrderItemID: " + response.data[0].OrderItemID);
	var orderItems = response.data;
	//alert("orderItems.length ="+ orderItems.length)
	for (i = 0; i < orderItems.length; i++) {
		var orderItemStatus = orderItems[i].Status;
		var orderItemString =
			'<div id="orderItem'+ orderItems[i].OrderID + '" class="orderItem'+orderItems[i].Status+'">' +
				'<div class="menuItemID'+ orderItems[i].MenuItemID +'"></div>' +
				'<div class="statusDiv">Status: ';
		if(orderItemStatus == "Ready") orderItemString += 'Ready';
		else if(orderItemStatus == "InPrep") orderItemString += 'In Prep';
		else orderItemString += 'New';
		orderItemString += '</div>';	
		var orderDivId = '#order'+orderItems[i].OrderID;
		$(orderDivId).append(orderItemString);
		
//		request("menuItem", orderItems[i].MenuItemID, RequestType.READ, userInfo, "", drawMenuItemInfo);
	}
}

function drawMenuItemInfo(response){
	alert("drawMenuItemInfo");
	var menuItems = response.data;
	for(i=0; i<menuItems.length; i++){
//		alert("menuItem.MenuItemID = " + menuItems[i].MenuItemID);
//		alert("menuItem.Category = " + menuItems[i].Category);
//		alert("menuItem.PrepTime = " + menuItems[i].PrepTime);
		var menuItemDivClass = '.menuItemID' + menuItems[i].MenuItemID;
		alert("menuItemDivClass = " + menuItemDivClass);
//		alert("menuItemDivID = " + menuItemDivID);
//		alert("$(menuItemDivID).length " + $(menuItemDivID).length);
		if($(menuItemDivClass).length > 0){
			var menuItemInfo = 
				'<div class="menuItemInfo">' +
					'<div class="menuItemInfoSnippet">' +
					menuItems[i].Name +
					'</div>' +
					'<div class="menuItemInfoSnippet">' +
					menuItems[i].Category +
					'</div>' +
					'<div class="menuItemInfoSnippet">' +
					'Prep time: ' + menuItems[i].PrepTime + ' min' +
					'</div>' +
				'</div>'; 
			alert("menuItemInfo = " + menuItemInfo);
			
			$(menuItemDivClass).append(menuItemInfo);	
		}	
	}
}


//function drawMenuItemInfo(response){
//	alert("drawMenuItemInfo");
//	var menuItem = response.data[0];
//	alert("menuItem.MenuItemID = " + menuItem.MenuItemID);
//	alert("menuItem.Category = " + menuItem.Category);
//	alert("menuItem.PrepTime = " + menuItem.PrepTime);
//	var menuItemInfo = 
//		'<div class="menuItemInfo">' +
//			'<div class="menuItemInfoSnippet">' +
//				menuItem.Name +
//			'</div>' +
//			'<div class="menuItemInfoSnippet">' +
//				menuItem.Category +
//			'</div>' +
//			'<div class="menuItemInfoSnippet">' +
//				menuItem.PrepTime +
//			'</div>' +
//		'</div>'; 
//	alert("menuItemInfo = " + menuItemInfo);
//	var menuItemDivID = '#menuItemID' + menuItem.MenuItemID;
//	alert("menuItemDivID = " + menuItemDivID);
//	$(menuItemDivID).append(menuItemInfo);
//}



// for each order, get the orderItems for each
// sort the order items by longest prep time first

// create a listing of the order items inside each order
// (draw a div for each order, and inside of it put
// 		a div for each orderItem)

// set a click handler to change the orderItem's status to:
// prep, if it's waiting
// ready, if it's in prep

// if all the orderItems in an order are ready, then remove the order from the screen
// but if only some are, display the "ready" ones a different color or something

// maybe color-code orders or alternate?

