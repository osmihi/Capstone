
// Called to render discounts screen
function discountsScreen() {
	// API call: request(resource, key, rqType, userInfoString, dataString,
	// successFunc, errorFunc)
	request("discount", "", RequestType.READ, userInfo, "", buildDiscountScreen);
}

function buildDiscountScreen(response) {
	
	var discounts = response.data;

	// Wipe page clean (remove previous existing content)
	$('#page').html("");
	
	// Creates form to create new discount
	drawDiscountInput();
	
	//Add click funtion to addDiscountButton
	$('.addDiscountButton').click(function() {
		discountCode = $(this).parents(".discount:first").find(".discountCode").val();
		discountValue = $(this).parents(".discount:first").find(".discountValue").val();
		discountType = $(this).parents(".discount:first").find(".discountType").val();
		addDiscount(discountCode, discountValue, discountType);
	});
	

	// Iterate through waitLists, call drawDiscount for each Discount
	for (i = 0; i < discounts.length; i++) {
		drawDiscount(discounts[i]);
	}
	
	//Add click function to discountUpdateButton
	$('.discountUpdateButton').click(function() {
		discountCode = $(this).parents(".discount:first").find(".discountCode").val();
		discountValue = $(this).parents(".discount:first").find(".discountValue").val();
		discountID = $(this).parents(".discount:first").find(".discountIdHolder").val();
		discountType = $(this).parents(".discount:first").find(".discountType").val();
		updateDiscount(discountID, discountCode, discountValue, discountType);
	});
	
	$('.discountDeleteButton').click(function(){
		discountID = $(this).parents(".discount:first").find(".discountIdHolder").val();
		deleteDiscount(discountID);
	});
}

// Creates form to create new discount
function drawDiscountInput(){
	$('#page').append(
			'<div id="newDiscount" class="discount">'+
					'Create a new discount: <br/>' +
					'Code: <input type="text" class="discountCode" value=""/><br />' + 
					'Value: <input type="text" class="discountValue" value=""/><br />'+ 
					'Type: ' + discountTypeSelector("Percent") + '<br />' +
					'<input type="button" class="addDiscountButton" value="Add"/>' +
			'</div>');
}

function discountTypeSelector(selectedDiscountType){
	var selectCode = '<select class="discountType" >';
	if(selectedDiscountType == "Amount"){
		selectCode += '<option value="Percent">Percent</option>' +
		'<option value="Amount" selected="selected">Dollars</option>';	
	}else{
		selectCode += '<option value="Percent" selected="selected">Percent</option>' +
		'<option value="Amount">Dollars</option>';	
	}
	return selectCode;
}

// Creates box containing party information
function drawDiscount(discount) {
	// Add div with discount info to page div
	$('#page').append(
			'<div id="discount' + discount.DiscountID + '" class="discount">'+
					'<input type="hidden" class="discountIdHolder" value ="'+ discount.DiscountID + '"/><br/>' +
					'Code: <input type="text" class="discountCode" value="' + discount.DiscountCode + '"/><br />' + 
					'Value: <input type="text" class="discountValue" value="' + discount.Value + '"/><br />'+ 
					'Type: ' + discountTypeSelector(discount.Type) + '<br />' +
					'<input type="button" class="discountUpdateButton" value="Update"/>' +
					'<input type="button" class="discountDeleteButton" value="Delete"/>' +
			'</div>');
}


function addDiscount(discountCode, discountValue, discountType){
	request("discount", "", RequestType.CREATE, userInfo, 
			"DiscountCode=" + discountCode + 
			"&Value=" + discountValue +
			"&Type=" + discountType, 
			discountsScreen, 
			discountErrorFunction);
}

// API call: request(resource, key, rqType, userInfoString, dataString,
// successFunc, errorFunc)
function updateDiscount(discountID, discountCode, discountValue, discountType){
	//alert(discountID + discountCode + discountValue + discountType)
	request("discount", discountID, RequestType.UPDATE, userInfo, 
			"DiscountID=" + discountID +
			"&DiscountCode=" + discountCode + 
			"&Value=" + discountValue +
			"&Type=" + discountType, 
			discountsScreen, 
			discountErrorFunction);
}

function deleteDiscount(discountID){
	request("discount", discountID, RequestType.DELETE, userInfo, 
			"DiscountID=" + discountID, 
			discountsScreen, 
			discountErrorFunction);
}

function discountErrorFunction(){
	alert("Error Function Called");
}