// bill page
// shows all the bills for all the orders at a table
// itemized, with total
// allows user to print the bill
// has payment stub for submitting & processing a payment
// if manager, can edit bill amounts
// can add discounts to the bill too I suppose

function billScreen() {
	request("bill", "", RequestType.READ, userInfo, "", function(response) {
		billScreen.billData = response.data;
		request("order", "", RequestType.READ, userInfo, "tableID=" + selectedTable.TableID, function(response) {
			billScreen.orderData = response.data;
			request("orderItem", "", RequestType.READ, userInfo, "", function(response) {
				billScreen.orderItemData = response.data;
				request("menuItem", "", RequestType.READ, userInfo, "", function(response) {
					billScreen.menuItemData = response.data;
					buildBillScreen();
				});
			});
		});
	});
}

function buildBillScreen() {
	$('#page').html("");

	// remove orders not at this table
	for (var i = 0; i < billScreen.orderData.length; i++) {
		if (billScreen.orderData[i].TableID != selectedTable.TableID) {
			billScreen.orderData.splice(i, 1);
		}
	}

	billScreen.orderData.sort(function(a, b) {
		if (a.Timestamp < b.Timestamp) return -1;
		else return 1;
	});

	// grab whichever bills apply to the orders at this table
	var billList = new Array();
	for (var i = 0; i < billScreen.orderData.length; i++) {
		billList.push(billScreen.orderData[i].BillID);
	}
	billList = billList.getUnique();

	for (var i = 0; i < billList.length; i++) {
		var thisBill;
		for (var j = 0; j < billScreen.billData.length; j++) {
			if (billList[i] == billScreen.billData[j].BillID) {
				thisBill = billScreen.billData[j];
			}
		}
		drawBill(thisBill);
	}	
}

function drawBill(thisBill) {
	var billTotal = 0;
	var theseOrders = new Array();
	for (var k = 0; k < billScreen.orderData.length; k++) {
		if (billScreen.orderData[k].BillID == thisBill.BillID) {
			theseOrders.push(billScreen.orderData[k]);
		} 
	}
	
	$('#page').append(
		'<div id="bill' + thisBill.BillID + 'Bill" ' + 'class="bill">' +
			'<span class="billTableNumber">Table ' + selectedTable.Number + '</span>' +
		'</div>'
	);

	for (var i = 0; i < theseOrders.length; i++) {
		drawOrderBill(theseOrders[i]);
		$('.order' + theseOrders[i].OrderID + 'Charge').each(function() {
			billTotal += money($(this).html());
		});
	}

	$('#bill' + thisOrder.BillID + 'Bill').append(
		'<div id="bill' + thisBill.BillID + 'Total" ' + 'class="bill">' +
			'<div class="billTotal">' + parseFloat(billTotal).toFixed(2) + '</div>' +
		'</div>'
	);

}

function drawOrderBill(thisOrder) {
	var theseOrderItems = new Array();
	for (var i = 0; i < billScreen.orderItemData.length; i++) {
		if (billScreen.orderItemData[i].OrderID == thisOrder.OrderID) {
			theseOrderItems.push(billScreen.orderItemData[i]);
		}
	}

	$('#bill' + thisOrder.BillID + 'Bill').append(
		'<div id="order' + thisOrder.OrderID + 'Bill" class="order">' +
			'<span class="orderTimestamp">' + thisOrder.Timestamp + '</span>' +
		'</div>'
	);

	for (var i = 0; i < theseOrderItems.length; i++) {
		drawOrderItemBill(theseOrderItems[i]);
	}
}

function drawOrderItemBill(thisOrderItem) {
	var thisItemName = "";
	for (var i = 0; i < billScreen.menuItemData.length; i++) {
		if (billScreen.menuItemData[i].MenuItemID == thisOrderItem.MenuItemID) {
			thisItemName = billScreen.menuItemData[i].Name;
		}
	}
	
	$('#order' + thisOrderItem.OrderID + 'Bill').append(
		'<div id="orderItem' + thisOrderItem.orderItemID + 'Bill" class="orderItem"/>' +
			'<table><tr>' + 
			'<td class="orderItemName">' + thisItemName + '</td>' +
			'<td class="order' + thisOrderItem.OrderID + 'Charge orderCharge">' + thisOrderItem.PurchasePrice + '</td>' +
			'</tr></table>' +
		'</div>'
	);
}