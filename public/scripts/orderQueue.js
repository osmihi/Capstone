//Global variables
var orderQueueOrders;
var orderQueueOrderItems;
var orderQueueMenuItems;
var orderQueueTables;
var tempOrderItemID;

// request(resource, key, rqType, userInfoString, dataString, successFunc,
// errorFunc)

// request for all orders
function orderQueueScreen() {
	request("order", "", RequestType.READ, userInfo, "",
			populateOrderQueueOrders);
}

function populateOrderQueueOrders(response) {
	orderQueueOrders = response.data;
	request("orderItem", "", RequestType.READ, userInfo, "",
			populateOrderQueueOrderItems);
}


function populateOrderQueueOrderItems(response) {
	orderQueueOrderItems = response.data;
	request("menuItem", "", RequestType.READ, userInfo, "",
			populateOrderQueueMenuItems);
}


function populateOrderQueueMenuItems(response) {
	orderQueueMenuItems = response.data;
	request("table", "", RequestType.READ, userInfo, "",
			populateOrderQueueTables);
}


function populateOrderQueueTables(response){
	orderQueueTables = response.data;
	buildOrderQueueScreen();
}


function buildOrderQueueScreen() {
	// Clear page
	$('#page').html("");
	
	addMenuInfoToOrderItems();
	addOrderItemsToOrders();
	addTablesToOrders();
	drawRefreshButton();
	
	if(allOrdersAreComplete()){
		drawNoOrdersMessage();
	}
	else{
		sortOrders();
		sortOrderItems();
				
		// Draw orderQueue
		for ( var i = 0; i < orderQueueOrders.length; i++) {
			if(!orderQueueOrders[i].allOrderItemsComplete){
				drawOrder(orderQueueOrders[i]);				
			}
		}
		addClickEvents();
	}

}



function addMenuInfoToOrderItems() {
	for ( var i = 0; i < orderQueueOrderItems.length; i++) {
		for ( var j = 0; j < orderQueueMenuItems.length; j++) {
			if (orderQueueOrderItems[i].MenuItemID == orderQueueMenuItems[j].MenuItemID) {
				orderQueueOrderItems[i].Name = orderQueueMenuItems[j].Name;
				orderQueueOrderItems[i].PrepTime = orderQueueMenuItems[j].PrepTime;
				orderQueueOrderItems[i].Category = orderQueueMenuItems[j].Category;
			}
		}
	}
}


function addOrderItemsToOrders() {
	for ( var i = 0; i < orderQueueOrders.length; i++) {
		var allOrderItemsComplete = true;
		var count = 0;
		var orderItemsArray = [];
		for ( var j = 0; j < orderQueueOrderItems.length; j++) {
			if (orderQueueOrderItems[j].OrderID == orderQueueOrders[i].OrderID) {
				orderItemsArray[count++] = orderQueueOrderItems[j];
				if(orderQueueOrderItems[j].Status != "Ready"){
					allOrderItemsComplete = false;
				}
			}
		}
		orderQueueOrders[i].orderItems = orderItemsArray;
		orderQueueOrders[i].allOrderItemsComplete = allOrderItemsComplete;
	}
}




function addTablesToOrders(){
	for ( var i = 0; i < orderQueueOrders.length; i++) {
		for ( var j = 0; j < orderQueueTables.length; j++) {
			if (orderQueueTables[j].TableID == orderQueueOrders[i].TableID) {
				orderQueueOrders[i].tableNumber = orderQueueTables[j].Number;	
			}
		}	
	}
}

function drawRefreshButton(){
	var refreshButton = '<div class="orderQueueRefreshButton"><h3>Refresh Page</h3></div>';
	$('#page').append(refreshButton);
}


function allOrdersAreComplete(){
	for(var i=0; i<orderQueueOrders.length; i++ ){
		if(!orderQueueOrders[i].allOrderItemsComplete){
			return false;
		}
	} 
	return true;
}


function drawNoOrdersMessage(){
	var noOrdersMessage = '<div class="noOrders"><h1>There are currently no orders in the queue.</h1></div>';
	$('#page').append(noOrdersMessage);		
}



function sortOrders() {
	// Sort orders
	orderQueueOrders.sort(function(objA, objB) {
		if (objA.Timestamp < objB.Timestamp)
			return -1;
		else
			return 1;
	});
}

function sortOrderItems() {
	// Sort orderItems
	for ( var i = 0; i < orderQueueOrders.length; i++) {
		orderQueueOrders[i].orderItems.sort(function(objA, objB) {
			if (objA.PrepTime > objB.PrepTime)
				return -1;
			else
				return 1;
		});
	}
}


function drawOrder(order) {
	drawOrderDiv(order);
	drawOrderItems(order)
}


function drawOrderDiv(order) {
	var tableString = $.isNumeric(order.tableNumber) ? order.tableNumber : "None";
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
	 for (i = 0; i < orderItems.length; i++) {
		 var orderItemString =
			 '<div id="orderItem' + orderItems[i].OrderItemID + '" class="orderItem orderItemStatus' + orderItems[i].Status + '">';
		 orderItemString += '<input type="hidden" class="orderItemIdHolder" value="'+orderItems[i].OrderItemID +'"/>';
		 orderItemString += '<div class="orderItemInfo orderItemStatus">Status: ' + orderItemStatusString(orderItems[i]) + '</div>';
		 orderItemString += '<div class="orderItemInfo orderItemName">' + orderItems[i].Name +'</div>';
		 orderItemString += '<div class="orderItemInfo orderItemCategory">' + orderItems[i].Category +'</div>';
		 if(orderItems[i].Notes){
			 orderItemString += '<div class="orderItemInfo" orderItemNotes>' + orderItems[i].Notes +'</div>';
		 }
		 orderItemString += '<div class="orderItemInfo">Prep time: ' +
		 orderItems[i].PrepTime + '</div></div>';
		 var orderDivId = '#order' + orderItems[i].OrderID;
		 $(orderDivId).append(orderItemString);	
		 if(order.allOrderItemsComplete){
			 $(orderDivId).hide('slow');
		 }
	}
}

function orderItemStatusString(orderItem){
	 if (orderItem.Status == "Ready"){ return 'Ready'; }
	 else if (orderItem.Status == "InPrep"){ return 'In Prep'; }
	 return 'New'; 
}
 
 
function addClickEvents() {
	$('.orderItem').click(function() {
		var orderItemId = $(this).find('.orderItemIdHolder').val();
		tempOrderItemID = orderItemId;
		getOrderItemForStatusUpdate(orderItemId);
	});
	
	$('.orderQueueRefreshButton').click(function() {
		orderQueueScreen();
	});
}

function getOrderItemForStatusUpdate(orderItemId) {
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
			"Status=" + newStatus, updateStatusDisplay);
}

function updateStatusDisplay(response){
	if(response.data[0] == null){
		alert("null");
	}
	var orderItem = response.data[0];
	var orderItemDivId = '#orderItem' + orderItem.OrderItemID;
	var orderItemDivClass = 'orderItem orderItemStatus' + orderItem.Status;
	$(orderItemDivId).attr('class', orderItemDivClass);
	$(orderItemDivId).find('.orderItemStatus').html('Status: ' + orderItemStatusString(orderItem)); 
	var orderDivID = '#order' + orderItem.OrderID;
	var newOrderItems = $(orderDivID).find('.orderItemStatusNew');
	var inPrepOrderItems = $(orderDivID).find('.orderItemStatusInPrep');
	
	if(newOrderItems.length + inPrepOrderItems.length < 1){
		$(orderDivID).hide('slow');
		$(orderDivID).attr('class', 'completedOrder');
		if($('#page').find('.order').length < 1){
			drawNoOrdersMessage();
		}
	}
}

function getOrder(orderID){
	for(var i = 0; i < orderQueueOrders.length; i++){
		if(orderQueueOrders[i].OrderID == orderID){
			return orderQueueOrders[i];
		}
	}
	return null;
}


