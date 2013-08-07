// bill page
// the bill for all the orders at a table
// itemized, with total
// allows user to print the bill
// has payment stub for submitting & processing a payment-*///////////////////////////////
// if manager, can edit bill amounts
// can add discounts to the bill too I suppose
// and need tips too

var Bill = function (tableID) {
	this.tableID = tableID;
};

Bill.prototype.setOrderData = function(data) {
	this.orderData = data;
};

Bill.prototype.setOrderItemData = function(data) {
	this.orderItemData = data;
};

Bill.prototype.setMenuItemData = function(data) {
	this.menuItemData = data;
};

Bill.prototype.setTipData = function(data) {
	this.tipData = data;
}

Bill.prototype.setDiscountedData = function(data) {
	this.discountedData = data;
}

Bill.prototype.setDiscountData = function(data) {
	this.discountData = data;
}

function billScreen() {
	refreshFunc = function() {};

	request("order", "", RequestType.READ, userInfo, "&tableID=" + selectedTable.TableID, function(response) {
		billScreen.orderData = response.data;
		request("orderItem", "", RequestType.READ, userInfo, "", function(response) {
			billScreen.orderItemData = response.data;
			request("menuItem", "", RequestType.READ, userInfo, "", function(response) {
				billScreen.menuItemData = response.data;
				request("tip", "", RequestType.READ, userInfo, "&tableID=" + selectedTable.TableID, function(response) {
					billScreen.tipData = response.data;
					request("discounted", "", RequestType.READ, userInfo, "&tableID=" + selectedTable.TableID, function(response) {
						billScreen.discountedData = response.data;
						request("discount", "", RequestType.READ, userInfo, "", function(response) {
							billScreen.discountData = response.data;
							buildBillScreen();
						});
					});
				});
			});
		});
	}, function(response) {
		alert("No orders have been placed at this table yet.");
	});
}

function buildBillScreen() {
	$('#page').html("");
	
	// assemble nested data structures
	for (var i = 0; i < billScreen.orderData.length; i++) {
		if (billScreen.orderData[i].TableID == selectedTable.TableID) {
			billScreen.orderData[i].orderItems = new Array();
			for (var j = 0; j < billScreen.orderItemData.length; j++) {
				if (billScreen.orderItemData[j].OrderID == billScreen.orderData[i].OrderID) {
					billScreen.orderData[i].orderItems.push(billScreen.orderItemData[j]);
				}
			}
		} else {
			// remove order from the array if it's not for this table
			billScreen.orderData.splice(i, 1);
		}
	}

	for (var i = 0; i < billScreen.orderData.length; i++) {
		for (var j = 0; j < billScreen.orderData[i].orderItems.length; j++) {
			for (var k = 0; k < billScreen.menuItemData.length; k++) {
				if (billScreen.menuItemData[k].MenuItemID == billScreen.orderData[i].orderItems[j].MenuItemID) {
					billScreen.orderData[i].orderItems[j].menuItem = billScreen.menuItemData[k]; 
				}
			}
		}
	}

	for (var i = 0; i < billScreen.discountedData.length; i++) {
		for (var j = 0; j < billScreen.discountData.length; j++) {
			if (billScreen.discountedData[i].DiscountID == billScreen.discountData[j].DiscountID) {
				billScreen.discountedData[i].discount = billScreen.discountData[j];
			}
		}
	}

	delete billScreen.menuItemData;
	delete billScreen.orderItemData;
	delete billScreen.discountData;

	// Sort by Timestamp. Not really necessary, but hey
	billScreen.orderData.sort(function(a, b) {
		if (a.Timestamp < b.Timestamp) return -1;
		else return 1;
	});

	// Write the bill data to the screen
	drawBill();

}

// sets a decimal, returns a string
billScreen.calculateTotal = function() {
	billScreen.billTotal = 0;
	for (var i = 0; i < billScreen.orderData.length; i++) {
		for (var j = 0; j < billScreen.orderData[i].orderItems.length; j++) {
			billScreen.billTotal += money(billScreen.orderData[i].orderItems[j].PurchasePrice);
		}
	}

	billScreen.discountAmounts = new Array();

	for (var i = 0; i < billScreen.discountedData.length; i++) {
		if (billScreen.discountedData[i].discount.Type == "Percent") {
			billScreen.discountAmounts[i] = money( (Number(billScreen.discountedData) / 100) * billScreen.billTotal);
		} else {
			billScreen.discountAmounts[i] = money(billScreen.discountedData[i].discount.Value);
		}
		
		billScreen.billTotal -= billScreen.discountAmounts[i];
		
	}

	for (var i = 0; i < billScreen.tipData.length; i++) {
		billScreen.billTotal += money(billScreen.tipData[i].Amount);
	}

	return parseFloat(billScreen.billTotal).toFixed(2);
}

function drawBill() {

	var totalBill = billScreen.calculateTotal();

	// Bill table
	$('#page').append(
		'<div id="table' + selectedTable.TableID + 'Bill" ' + 'class="bill">' +
			'<div class="billHeader">Table ' + selectedTable.Number + ' Bill' + 
				'<div id="billPrint" class="billPrint">' + 'Print' + '</div>' +
			'</div>' +
			'<table id="table' + selectedTable.TableID + 'BillTable" class="billTable">' + 
			'</table>' + 
		'</div>'
	);

	$('#billPrint').click(function() {
		var newWin = window.open('', 'thePopup', '');
		newWin.document.write('<html><body>' + $('#table' + selectedTable.TableID + 'Bill').html() + '</body></html>');
		newWin.window.location.reload();    // this is the secret ingredient
		newWin.focus();                     // not sure if this line is necessary
		newWin.print();
	});

	// Order Items
	for (var i = 0; i < billScreen.orderData.length; i++) {
		for (var j = 0; j < billScreen.orderData[i].orderItems.length; j++) {
			addBillRow(billScreen.orderData[i].orderItems[j].menuItem.Name, billScreen.orderData[i].orderItems[j].PurchasePrice, true);
		}
		addBillRow('','', false);
	}

	// Discounts
	for (var i = 0; i < billScreen.discountedData.length; i++) {		
		addBillRow('Discount: ' + billScreen.discountedData[i].discount.DiscountCode, money(billScreen.discountAmounts[i]).toFixed(2), true);
	}

	// Tip(s)
	for (var i = 0; i < billScreen.tipData.length; i++) {
		addBillRow('Tip', billScreen.tipData[i].Amount, true, function() {
			// problem here in that we need to pass the ID too because it doesn't have it when called from change context
			//request("tip", billScreen.tipData[i].TipID, RequestType.UPDATE, userInfo, "amount=" + this.value, function() {});
		});
	}

	// Total
	addBillRow('','', false);
	addBillRow('Total', totalBill, false, null, 'billTotal');
}

function addBillRow(itemName, itemValue, editable, changeFunc, rowClass) {
	if (arguments.length == 5) {
		rowClass = "billRow " + rowClass;
	} else {
		rowClass = "billRow ";
	}

	var row = $('<tr class="' + rowClass + '"></tr>');
	row.append('<td class="billItemName">' + itemName + '</td>');

	var priceCell = $('<td class="billPrice"></td>');

	if ( editable ) {
		var priceField = $('<input type="text" class="priceField"/>');
		priceField.val(itemValue);

		if (typeof(changeFunc) === 'function') priceField.change(changeFunc);

		priceCell.append(priceField);

	} else {
		priceCell.append(itemValue);
	}

	row.append(priceCell);

	$('#table' + selectedTable.TableID + 'BillTable').append(row);

}