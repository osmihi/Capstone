//Global variables
var orderQueueOrders;
var orderQueueOrderItems;
var orderQueueMenuItems;
var orderQueueTables;
var tempOrderItemID;

var scrollScreen = false;

// request(resource, key, rqType, userInfoString, dataString, successFunc, errorFunc)

// request for all orders
function orderQueueScreen() {
	$('.navButton').css("font-weight", "normal");
	$('.orderQueueScreen').css("font-weight", "bold");
	
	refreshFunc = function() {};
	
	$("html, body").stop(true);
	window.scrollTo(0,0);
	
	request("order", "", RequestType.READ, userInfo, "",
			populateOrderQueueOrders, populateOrderQueueOrders);
	
	refreshFunc = orderQueueScreen;
}


//orderQueueOrders will hold the order data locally
function populateOrderQueueOrders(response) {
	orderQueueOrders = response.data;
	if(orderQueueOrders == null){
			$('#page').html("");
			drawNoOrdersMessage();
	}
	else{
			request("orderItem", "", RequestType.READ, userInfo, "",
			populateOrderQueueOrderItems);
	}
}

//orderQueueOrderItems will hold orderItem data locally
function populateOrderQueueOrderItems(response) {
	orderQueueOrderItems = response.data;
	request("menuItem", "", RequestType.READ, userInfo, "",
			populateOrderQueueMenuItems);
}


// orderQueueMenuItems will hold menuItem data locally
function populateOrderQueueMenuItems(response) {
	orderQueueMenuItems = response.data;
	request("table", "", RequestType.READ, userInfo, "",
			populateOrderQueueTables);
}


// orderQueueTables will hold tables locally
function populateOrderQueueTables(response){
	orderQueueTables = response.data;
	buildOrderQueueScreen();
}


//Render the orderQueue screen
function buildOrderQueueScreen() {
	
	$('#page').html("");

	addMenuInfoToOrderItems();
	addOrderItemsToOrders();
	addTablesToOrders();
	
	if(allOrdersAreComplete()){
		drawNoOrdersMessage();
	}
	else{
		sortOrders();
		sortOrderItems();

		var checked = scrollScreen ? 'checked="true"' : '';
		
		var scrollCheck = $('<input type="checkbox" id="scrollScreen" ' + checked + '/>'); 
		
		scrollCheck.change(function () {
			scrollScreen = this.checked;
			enableScroll();
		});
		
		$('#page').append('<div id="scrollCtrl"> Scrolling</div>');
		$('#scrollCtrl').prepend(scrollCheck);

		// Draw orderQueue
		for ( var i = 0; i < orderQueueOrders.length; i++) {
			if(!orderQueueOrders[i].allOrderItemsComplete){
				drawOrderDiv(orderQueueOrders[i]);
				drawOrderItems(orderQueueOrders[i]);			
			}
		}
	}
	addOrderQueueClickFunctions();
	
	enableScroll();
}


//Adds Name, PrepTime, and Category properties to each orderItem
function addMenuInfoToOrderItems() {
	if(orderQueueOrderItems != null){
		for ( var i = 0; i < orderQueueOrderItems.length; i++) {
			if(orderQueueMenuItems != null){
				for ( var j = 0; j < orderQueueMenuItems.length; j++) {
					if (orderQueueOrderItems[i].MenuItemID == orderQueueMenuItems[j].MenuItemID) {
						orderQueueOrderItems[i].Name = orderQueueMenuItems[j].Name;
						orderQueueOrderItems[i].PrepTime = orderQueueMenuItems[j].PrepTime;
						orderQueueOrderItems[i].Category = orderQueueMenuItems[j].Category;
					}
				}
			}
		}
	}
}


// Adds orderItems to their parent order
function addOrderItemsToOrders() {
	if(orderQueueOrders != null){
		for ( var i = 0; i < orderQueueOrders.length; i++) {
				var allOrderItemsComplete = true;
				var count = 0;
				var orderItemsArray = [];
				if(orderQueueOrderItems != null){
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
	}
}


// Adds table number to each order
function addTablesToOrders(){
	if(orderQueueOrders != null){
		for ( var i = 0; i < orderQueueOrders.length; i++) {
			if(orderQueueTables != null){
				for ( var j = 0; j < orderQueueTables.length; j++) {
					if (orderQueueTables[j].TableID == orderQueueOrders[i].TableID) {
						orderQueueOrders[i].tableNumber = orderQueueTables[j].Number;	
					}
				}
			}
		}
	}
}


//Returns true if all orderItems in all orders are complete
function allOrdersAreComplete(){
	for(var i=0; i<orderQueueOrders.length; i++ ){
		if(!orderQueueOrders[i].allOrderItemsComplete){
			return false;
		}
	} 
	return true;
}


// Indicates that all orders have been completed
function drawNoOrdersMessage(){
	var noOrdersMessage = '<div class="noOrders"><h1>There are currently no orders in the queue.</h1></div>';
	$('#page').append(noOrdersMessage);		
}


// Sorts orders FIFO
function sortOrders() {
	orderQueueOrders.sort(function(objA, objB) {
		if (objA.Timestamp < objB.Timestamp)
			return -1;
		else
			return 1;
	});
}


// Sorts orderItems for each order in order of longest prep time first
function sortOrderItems() {
	for ( var i = 0; i < orderQueueOrders.length; i++) {
		orderQueueOrders[i].orderItems.sort(function(objA, objB) {
			if (parseInt(objA.PrepTime) > parseInt(objB.PrepTime))
				return -1;
			else
				return 1;
		});
	}
}


//Renders the order div 
function drawOrderDiv(order) {
	var tableString = $.isNumeric(order.tableNumber) ? order.tableNumber : "None";	
	var ts = new Date(order.Timestamp);
	var timeString = ts.toLocaleTimeString();

	var orderHeadingString = '<div id="order' + order.OrderID
			+ '" class="order formButton">' + '<div class="orderHeading">'
			+ '<div class="orderHeadingInfo">'
			+ 'Table #<span class="orderTableID">' + tableString + '</span>'
			+ '</div>' + '<div class="orderHeadingTime">' + timeString
			+ '</div>' + '</div>' + '</div>';
	$('#page').append(orderHeadingString)
}


// Renders the order item divs inside of their parent order div
 function drawOrderItems(order) {
	 var orderItems = order.orderItems;

	 for (i = 0; i < orderItems.length; i++) {
		 var orderItemString =
			 '<div id="orderItem' + orderItems[i].OrderItemID + '" class="formButton orderItem orderItemStatus' + orderItems[i].Status + '">';
		 orderItemString += '<input type="hidden" class="orderItemIdHolder" value="'+orderItems[i].OrderItemID +'"/>';
		 orderItemString += '<input type="hidden" class="orderItemStatusHolder" id="orderItemStatus'+ orderItems[i].OrderItemID +'" value="'+orderItems[i].Status +'"/>';
		 orderItemString += '<div class="orderItemInfo orderItemStatusDisplay">' + orderItemStatusString(orderItems[i]) + '</div>';
		 orderItemString += '<div class="orderItemInfo orderItemName">' + orderItems[i].Name +'</div>';
		 if(orderItems[i].Notes){
			 orderItemString += '<div class="orderItemInfo orderItemNotes">' + orderItems[i].Notes +'</div>';
		 }
		 orderItemString += '<div class="orderItemDetails">';
		 orderItemString += '<div class="orderItemInfo orderItemCategory">' + orderItems[i].Category +'</div><br />';
		 orderItemString += '<div class="orderItemInfo orderItemPrep">' + orderItems[i].PrepTime + ' min prep</div>';
		 orderItemString += '</div>';
		 orderItemString += '</div>';

		var orderDivId = '#order' + orderItems[i].OrderID;

		$(orderDivId).append(orderItemString);

		if(order.allOrderItemsComplete){
			$(orderDivId).hide('slow');
		}

		if (orderItems[i].Status == 'Ready') {
			$('#orderItem' + orderItems[i].OrderItemID).children().addClass('orderItemReady');
		}
	}
}


// Returns the status string to be displayed on screen for an order item
function orderItemStatusString(orderItem){
	 if (orderItem.Status == "Ready"){ return 'Ready'; }
	 else if (orderItem.Status == "InPrep"){ return 'In Prep'; }
	 return 'New'; 
}
 


//Add click functions to clickable objects
function addOrderQueueClickFunctions(){
	$('.orderItem').click(function() {
		var orderItemId = $(this).find('.orderItemIdHolder').val();
		var orderItemStatusId = '#orderItemStatus' + orderItemId;
		var orderItemStatus = $(orderItemStatusId).val();
		if(orderItemStatus == 'New'){
			$(this).attr('class', 'formButton orderItem orderItemStatusInPrep');
			$(orderItemStatusId).val('InPrep');
			$(this).find('.orderItemStatusDisplay').html('In Prep');
		}
		else{			
				$(this).attr('class', 'formButton orderItem orderItemStatusReady');
				$(orderItemStatusId).val('Ready');
				$(this).find('.orderItemStatusDisplay').html('Ready');
				$(this).find('.orderItemPrep').hide('fast');
				$(this).children().addClass('orderItemReady');
		}
		updateOrderItemStatus(orderItemId, orderItemStatus);
	});
	
}


//Update orderItem status on database
function updateOrderItemStatus(orderItemId, orderItemStatus) {
	var currentStatus = orderItemStatus;
	var newStatus = "InPrep";
	if (currentStatus == "InPrep") {
		newStatus = "Ready";
	} else if (currentStatus == "Ready") {
		return;
	}
	request("orderItem", orderItemId, RequestType.UPDATE, userInfo,
			"Status=" + newStatus, updateStatusDisplay);
}

//Hide completed orders
function updateStatusDisplay(response){
	var orderItem = response.data[0];
	var orderItemDivId = '#orderItem' + orderItem.OrderItemID;
	var orderItemDivClass = 'orderItem orderItemStatus' + orderItem.Status;
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

function enableScroll() {
	$("html, body").keydown(cancelScroll);
	$("html, body").mousedown(cancelScroll);

	if (scrollScreen) $("html, body").animate({ scrollTop: $(document).height() }, 40000);
}

function cancelScroll() {
	$("html, body").stop(true);
}