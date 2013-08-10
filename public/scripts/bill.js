// bill page
// the bill for all the orders at a table
// itemized, with total
// allows user to print the bill
// has payment stub for submitting & processing a payment-*///////////////////////////////
// if manager, can edit bill amounts
// can add discounts to the bill too I suppose
// and need tips too

function billScreen() {
	refreshFunc = function() {};
	
	selectedBill = new Bill(selectedTable.TableID);
}

// Define the Bill "class"
var Bill = function (tableID) {
	var _this = this; // _this is used so that we can reference the object scope in nested functions
	this.tableID = tableID;
	
	request("order", "", RequestType.READ, userInfo, "&tableID=" + tableID, function(response) {
		_this.orderData = response.data;
		request("orderItem", "", RequestType.READ, userInfo, "", function(response) {
			_this.orderItemData = response.data;
			request("menuItem", "", RequestType.READ, userInfo, "", function(response) {
				_this.menuItemData = response.data;
				request("tip", "", RequestType.READ, userInfo, "&tableID=" + tableID, function(response) {
					_this.tipData = response.data;
					request("discounted", "", RequestType.READ, userInfo, "&tableID=" + tableID, function(response) {
						_this.discountedData = response.data;
						request("discount", "", RequestType.READ, userInfo, "", function(response) {
							_this.discountData = response.data;
							_this.assembleData();
							_this.recalculate();
							_this.draw();
						});
					});
				});
			});
		});
	}, function(response) {
		alert("No orders have been placed at this table yet.");
	});
};

Bill.prototype.assembleData = function() {
	// assemble nested data structures
	for (var i = 0; i < this.orderData.length; i++) {
		if (this.orderData[i].TableID == this.tableID) {
			this.orderData[i].orderItems = new Array();
			for (var j = 0; j < this.orderItemData.length; j++) {
				if (this.orderItemData[j].OrderID == this.orderData[i].OrderID) {
					this.orderData[i].orderItems.push(this.orderItemData[j]);
				}
			}
		} else {
			// remove order from the array if it's not for this table
			this.orderData.splice(i, 1);
		}
	}

	for (var i = 0; i < this.orderData.length; i++) {
		for (var j = 0; j < this.orderData[i].orderItems.length; j++) {
			for (var k = 0; k < this.menuItemData.length; k++) {
				if (this.menuItemData[k].MenuItemID == this.orderData[i].orderItems[j].MenuItemID) {
					this.orderData[i].orderItems[j].menuItem = this.menuItemData[k]; 
				}
			}
		}
	}

	for (var i = 0; i < this.discountedData.length; i++) {
		for (var j = 0; j < this.discountData.length; j++) {
			if (this.discountedData[i].DiscountID == this.discountData[j].DiscountID) {
				this.discountedData[i].discount = this.discountData[j];
			}
		}
	}

	delete this.menuItemData;
	delete this.orderItemData;
	delete this.discountData;

	// Sort by Timestamp. Not really necessary, but hey
	this.orderData.sort(function(a, b) {
		if (a.Timestamp < b.Timestamp) return -1;
		else return 1;
	});	
};

Bill.prototype.recalculate = function() {
	this.billTotal = 0;
	
	this.billItems = new Array();

	// Order Items
	for (var i = 0; i < this.orderData.length; i++) {
		for (var j = 0; j < this.orderData[i].orderItems.length; j++) {
			var thisPrice = Number(this.orderData[i].orderItems[j].PurchasePrice); 
			
			this.billItems.push(new Array(
				'orderItem',
				this.orderData[i].orderItems[j].OrderItemID,
				this.orderData[i].orderItems[j].menuItem.Name, 
				thisPrice
			));
			
			this.billTotal += thisPrice;
		}
	}

	// Discounts
	for (var i = 0; i < this.discountedData.length; i++) {		
		var thisDiscount;
		
		if (this.discountedData[i].discount.Type == "Percent") {
			thisDiscount = Number(this.discountedData[i].discount.Value) / 100 * this.billTotal * -1;
		} else {
			thisDiscount = Number(this.discountedData[i].discount.Value) * -1;
		}

		this.billItems.push(new Array(
			'discount',
			this.discountedData[i].discount.DiscountID,
			this.discountedData[i].discount.DiscountCode,
			thisDiscount
		));
		
		this.billTotal += thisDiscount;
	}

	// Tip(s)
	for (var i = 0; i < this.tipData.length; i++) {
		var thisTip = Number(this.tipData[i].Amount); 
		
		this.billItems.push(new Array(
			'tip',
			this.tipData[i].TipID,
			'Gratuity',
			thisTip
		));
		
		this.billTotal += thisTip;
	}

	// Total
	this.billTotal = Math.round(this.billTotal * 100) / 100;
	
	this.billItems.push(new Array(
		'total',
		'',
		'Total',
		this.billTotal
	));
}

Bill.prototype.draw = function() {
	var _this = this;

	$('#page').html("");
	
	console.log(this);

	// print button
	var printButton = $('<div id="billPrint" class="billPrint">' + 'Print' + '</div>');
	$(printButton).click(function() {
		_this.printBill();
	});
	
	// pay button
	var payButton = $('<div id="billPay" class="billPay">' + 'Pay Bill' + '</div>');
	$(payButton).click(function() {
		_this.payBill();
	});

	// list of bill items
		// 'x' by each
		// if manager, order item prices are editable
	
	// add tip 
	// add discount 
	
	$('#page').append(printButton);
	$('#page').append(payButton);
};

Bill.prototype.drawBill = function() {
	
}

Bill.prototype.payBill = function() {
	console.log('Here\'s where the bill would be paid.');
}

Bill.prototype.printBill = function() {
	this.recalculate();
	var printWin = window.open('', 'PrintWindow', 'width=480,height=640,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes');
	printWin.document.writeln('<html><body><pre><div id="billPrintout"></div></pre></body></html>');
		
	var billTitle = $('<span>' + 'Thank you for dining at ' + restaurant.Name + '!' + '</span><br /><br />');
	
	var curDateTime = new Date();
	
	var billDate = $('<span>' + curDateTime.toLocaleDateString() + ' ' + curDateTime.toLocaleTimeString() + '</span><br /><br />');

	var printTable = $(
		'<table id="printTable">' +
		'</table>'
	);

	for (var i = 0; i < this.billItems.length; i++) {
		var itemName;

		if (this.billItems[i][0] == 'discount') {
			itemName = "Discount: " + this.billItems[i][2]; 
		} else {
			itemName = this.billItems[i][2];
		}

		var thisRow = $(
			'<tr>' +
				'<td>' +
					itemName + 
				'</td>' +
				'<td>' +
					'            ' + 
				'</td>' +
				'<td style="text-align:right;">' +
					Number(this.billItems[i][3]).toFixed(2) + 
				'</td>' +
			'</tr>'
		);

		if (this.billItems[i][0] == 'total') {
			if (this.tipData.length < 1) {
				printTable.append('<tr><td>Gratuity</td><td></td><td></td>__________</tr>');
				printTable.append('<tr><td></td><td></td><td></td></tr>');
			}
			
			printTable.append('<tr><td></td><td></td><td></td></tr>');
		}
		
		printTable.append(thisRow);
	};

	var signatureLine = $('<br/><br /><br /><span>Signature: </span> <span>_______________________________</span>');

	$('#billPrintout', printWin.document).append(billTitle);
	$('#billPrintout', printWin.document).append(billDate);
	$('#billPrintout', printWin.document).append(printTable);
	$('#billPrintout', printWin.document).append(signatureLine);
		
	printWin.document.close();
	//printWin.window.location.reload();
	printWin.focus();
	printWin.print();
	printWin.close();
};

// leftover functions, to be deleted.
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