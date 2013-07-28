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
	
	
	request("menuItem", "", RequestType.READ, userInfo, "", addClickEvents);

		
}



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
			'<div id="orderItem'+ orderItems[i].OrderID + '" class="orderItem orderItemStatus'+orderItems[i].Status+'">' +
			'<input type="hidden" class="orderItemIdHolder" value="'+ orderItems[i].OrderItemID +'"/>' +	
			'<div class="menuItemID'+ orderItems[i].MenuItemID +'"></div>' +
				'<div class="statusDiv">Status: ';
		if(orderItemStatus == "Ready") orderItemString += 'Ready';
		else if(orderItemStatus == "InPrep") orderItemString += 'In Prep';
		else orderItemString += 'New';
		orderItemString += '</div>';	
		var orderDivId = '#order'+orderItems[i].OrderID;
		$(orderDivId).append(orderItemString);
	}
	//Add click functions

}

function drawMenuItemInfo(response){
	alert("drawMenuItemInfo");
	var menuItems = response.data;
	for(i=0; i<menuItems.length; i++){
		var menuItemDivClass = '.menuItemID' + menuItems[i].MenuItemID;
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

function addClickEvents(){
	$('.orderItem').click(function() {
			var orderItemId = $(this).find(".orderItemIdHolder").val();
			alert("orderItemId = " + orderItemId);
//			getOrderItemForStatusUpdate(orderItemId); 
	});	
}





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

