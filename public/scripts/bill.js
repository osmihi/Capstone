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

	selectedBill = new Bill(selectedTable);
}

// Define the Bill "class"
var Bill = function (selTable) {
	var _this = this; // _this is used so that we can reference the object scope in nested functions
	this.table = selTable;
	this.tableID = selTable.TableID;

	request("order", "", RequestType.READ, userInfo, "&tableID=" + _this.tableID, function(response) {
		_this.orderData = response.data !== undefined ? response.data : new Array();
		request("orderItem", "", RequestType.READ, userInfo, "", function(response) {
			_this.orderItemData = response.data !== undefined ? response.data : new Array();
			request("menuItem", "", RequestType.READ, userInfo, "", function(response) {
				_this.menuItemData = response.data !== undefined ? response.data : new Array();
				request("tip", "", RequestType.READ, userInfo, "&tableID=" + _this.tableID, function(response) {
					_this.tipData = response.data !== undefined ? response.data : new Array();
					request("discounted", "", RequestType.READ, userInfo, "&tableID=" + _this.tableID, function(response) {
						_this.discountedData = response.data !== undefined ? response.data : new Array();
						request("discount", "", RequestType.READ, userInfo, "", function(response) {
							_this.discountData = response.data !== undefined ? response.data : new Array();
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

	// Sort discounts by type
	this.discountedData.sort(function(a, b) {
		if (a.discount.Type < b.discount.Type) return -1;
		else return 1;
	});

	delete this.menuItemData;
	delete this.orderItemData;

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
			this.discountedData[i].DiscountedID,
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

	var billHeader = $('<div class="billHeader pageHeader">Table ' + selectedTable.Number + ' Bill</div>');

	// print button
	var printButton = $('<div id="billPrint" class="formButton billBtn billTopR">' + 'Print' + '</div>');
	$(printButton).click(function() {
		_this.printBill();
	});

	// pay button
	var payButton = $('<div id="billPay" class="formButton billBtn billTopR">' + 'Pay Bill' + '</div>');
	$(payButton).click(function() {
		_this.payBill();
	});

	// list of bill items // 'x' by each // if manager, order item prices are editable
	var billItems = this.drawBillItems();

	// add tip
	var addTip = this.drawAddTip();

	// add discount
	var addDiscount = this.drawAddDiscount();

	$('#page').append(billHeader);
	$('#page').append(addTip);
	$('#page').append(addDiscount);
	$('#page').append(printButton);
	$('#page').append(payButton);
	$('#page').append(billItems);
};

Bill.prototype.drawAddTip = function() {
	var addTip = $('<div id="addTip" class="formButton billBtn billAdd billTopL"></div>');

	$(addTip).append('<input type="text" id="addTipAmount"/>');
	$(addTip).append('<input type="button" id="addTipSubmit" value="Add Tip"/>');

	$('#addTipSubmit', addTip).click(function() {
		var _this = this;
		var amount = $('#addTipAmount', $(this).parent()).val();
		request('tip', '', RequestType.CREATE, userInfo, 'TableID=' + selectedTable.TableID + '&UserID=' + selectedTable.UserID + '&Amount=' + amount, billScreen, function() {
			$('#addTipAmount', $(_this).parent()).val('');
			alert('Error creating tip.');
		});
	});

	return addTip;
};

Bill.prototype.drawAddDiscount = function() {
	var addDiscount = $('<div id="addDiscount" class="formButton billBtn billAdd billTopL"></div>');
	$(addDiscount).append('<select id="addDiscountSelect"></select>');
	
	for (var j = 0; j < this.discountData.length; j++) {
		var optLabel;
		
		if (this.discountData[j].Type == 'Percent') {
			 optLabel = this.discountData[j].DiscountCode + ' (' + this.discountData[j].Value + '%)';
		} else {
			 optLabel = this.discountData[j].DiscountCode + ' ($' + this.discountData[j].Value + ')';
		}

		$('#addDiscountSelect', addDiscount).append(
			'<option value="' + this.discountData[j].DiscountID + '">' + optLabel + '</option>'
		);
	}

	$(addDiscount).append('<input type="button" id="addDiscountSubmit" value="Add Discount"/>');
	$('#addDiscountSubmit', addDiscount).click(function() {
		var _this = this;
		var discountID = $('#addDiscountSelect', $(this).parent()).val();

		request('discounted', '', RequestType.CREATE, userInfo, 'TableID=' + selectedTable.TableID + '&DiscountID=' + discountID , billScreen, function() {
			alert('Error adding discount.');
		});
	});
	
	return addDiscount;
};

Bill.prototype.drawBillItems = function() {
	var _this = this;

	var billItems = $('<div id="billItems"></div>');
	
	for (var i = 0; i < this.billItems.length; i++) {
		var name;

		if (this.billItems[i][0] == 'discount') {
			name = "Discount: " + this.billItems[i][2]; 
		} else {
			name = this.billItems[i][2];
		}

		var thisBillItem = $('<div id="billItem' + i + '" class="formButton billItem ' + this.billItems[i][0] + 'Bill"></div>');

		var rsc = this.billItems[i][0] == 'discount' ? 'discounted' : this.billItems[i][0];

		$(thisBillItem).append('<input type="hidden" id="billItem' + i + 'ID" class="billItemID" value="' + this.billItems[i][1] + '"/>');
		$(thisBillItem).append('<input type="hidden" id="billItem' + i + 'Rsc" class="billItemRsc" value="' + rsc + '"/>');
		
		var delBtn;

		if (this.billItems[i][0] != 'total') {
			delBtn = $(
				'<div id="billItemDelete' + i + '" class="billItemDelete">' + 
					'X' + 
				'</div>'
			);
			
			$(delBtn).click(function() {
				var thisID = $('.billItemID', $(this).parent()).val();
				var thisRsc = $('.billItemRsc', $(this).parent()).val();

				request(thisRsc, thisID, RequestType.DELETE, userInfo, '', billScreen, billScreen);
			});

		} else {
			delBtn = $('<div class="billItemNoDelete"></div>');
		}

		var itemName = $('<div class="billItemName">' + name + '</div>');

		var itemPrice;
		
		if (userRole == 'Manager' && this.billItems[i][0] != 'total' && this.billItems[i][0] != 'discount' ) {
			itemPrice = $('<div class="billItemPrice"><input id="billItem' + i + 'Price" class="price priceEdit" value="' + Number(this.billItems[i][3]).toFixed(2) + '"/></div>');

			$('.priceEdit', itemPrice).change(function() {
				var thisID = $('.billItemID', $(this).parents('.billItem')).val();
				var thisRsc = $('.billItemRsc', $(this).parents('.billItem')).val();
				var thisField = thisRsc == 'tip' ? 'Amount' : 'PurchasePrice';

				request(thisRsc, thisID, RequestType.UPDATE, userInfo, thisField + '=' + this.value, billScreen, billScreen);
			});

		} else {
			itemPrice = $('<div class="billItemPrice"><input id="billItem' + i + 'Price" readonly="true" class="price priceNoEdit" value="' + Number(this.billItems[i][3]).toFixed(2) + '"/></div>');
		}

		$(thisBillItem).append(delBtn);
		$(thisBillItem).append(itemName);
		$(thisBillItem).append(itemPrice);

		$(billItems).append(thisBillItem);
	}

	return billItems;
}

Bill.prototype.payBill = function() {
	var _this = this;

	var ccNum = prompt('Swipe credit card, or enter \'0\' for Cash.', '');

	if (isNumber(ccNum) && ccNum && ccNum.length > 0) {
		request('table', '', RequestType.DELETE, userInfo, 'tableID=' + _this.tableID, function() {
			request('table', '', RequestType.CREATE, userInfo, 'Number=' + _this.table.Number + '&Status=Occupied&Paid=1&Capacity=' + _this.table.Capacity + '&UserID=' + _this.table.UserID, function(response) {
				selectedTable = response.data[0];
				alert('Payment accepted.');
				tablesScreen();
			});
		}, function() {
			alert('Unable to process payment.');
		});
	} else {
		alert('Payment rejected.');
	}

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
				printTable.append('<tr><td>Gratuity</td><td></td><td>__________</td></tr>');
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
