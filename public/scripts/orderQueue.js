

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
		//alert("buildOrderQueueScreen: orders[i].OrderID = " + orders[i].OrderID);
		drawOrderDiv(orders[i]);
	}
	request("table", "", RequestType.READ, userInfo, "", fillInTableNumbers);
}

function drawOrderDiv(order){
	drawOrderHeading(order);
	alert("drawOrderDiv: order.OrderID = "+ order.OrderID);
	//request("orderItem", "", RequestType.READ, userInfo, "orderID="+ order.OrderID, drawOrderItems, alert("failure in drawOrderDiv"));
	request("orderItem", "", RequestType.READ, userInfo, "OrderID="+ order.OrderID, drawOrderItems, alert("failure in drawOrderDiv"));
	$('#page').append('</div>');
	//$('#page').append(orderDiv);
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

function drawOrderHeading(order){
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
		//'Assignee: <span class="assigneeUserID">' + userString + '</span><br />' + 
			'</div>';
	$('#page').append(orderHeadingString)
	//return orderHeadingString;
}

function drawOrderItems(response){
	alert("drawOrderItems");
	var orderItems = response.data;
	for (i = 0; i < orderItems.length; i++) {
		alert("orderItems[i].OrderID = " + orderItems[i].OrderID);
	}
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

