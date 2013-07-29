// bill page
// shows all the bills for all the orders at a table
// itemized, with total
// allows user to print the bill
// has payment stub for submitting & processing a payment-*///////////////////////////////
// if manager, can edit bill amounts
// can add discounts to the bill too I suppose
// and need tips too

function billScreen() {
	request("bill", "", RequestType.READ, userInfo, "", function(response) {
		billScreen.billData = response.data;
		request("order", "", RequestType.READ, userInfo, "&tableID=" + selectedTable.TableID, function(response) {
			billScreen.orderData = response.data;
			request("orderItem", "", RequestType.READ, userInfo, "", function(response) {
				billScreen.orderItemData = response.data;
				request("menuItem", "", RequestType.READ, userInfo, "", function(response) {
					billScreen.menuItemData = response.data;
					buildBillScreen();
				});
			});
		}, function(response) {
			alert("No orders have been placed at this table yet.");
		});
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

	delete billScreen.billData;
	delete billScreen.menuItemData;
	delete billScreen.orderItemData;

	// Sort by Timestamp. Not really necessary, but hey
	billScreen.orderData.sort(function(a, b) {
		if (a.Timestamp < b.Timestamp) return -1;
		else return 1;
	});

	console.log(billScreen.orderData);
	console.log(billScreen.calculateTotal());

	// One bill per table right now
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
	return parseFloat(billScreen.billTotal).toFixed(2);
}

function drawBill() {	
	$('#page').append(
		'<div id="table' + selectedTable.TableID + 'Bill" ' + 'class="bill">' +
			'<div class="billHeader">Table ' + selectedTable.Number + ' Bill' + 
				'<div id="table' + selectedTable.TableID + 'Print" class="billPrint">' + 'Print' + '</div>' +
			'</div>' +
			'<table id="table' + selectedTable.TableID + 'BillTable" class="billTable">' + 
			'</table>' + 
		'</div>'
	);

	for (var i = 0; i < billScreen.orderData.length; i++) {
		for (var j = 0; j < billScreen.orderData[i].orderItems.length; j++) {
			$('#table' + selectedTable.TableID + 'BillTable').append(
				'<tr>' +
					'<td>' + billScreen.orderData[i].orderItems[j].menuItem.Name + '</td>' +
					'<td>' + billScreen.orderData[i].orderItems[j].PurchasePrice + '</td>' +
				'</tr>'
			);
		}

		$('#table' + selectedTable.TableID + 'BillTable').append(
			'<tr>' + '<td></td>' + '<td></td>' + '</tr>'
		);
	}
	
	$('#table' + selectedTable.TableID + 'BillTable').append(
			'<tr>' + '<td></td>' + '<td></td>' + '</tr>' +
			'<tr class="billTotal">' + '<td>Total</td>' + '<td>' + billScreen.calculateTotal() + '</td>' + '</tr>'
		);
}