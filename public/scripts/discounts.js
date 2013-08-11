
// Called to render discounts screen
function discountsScreen() {
	refreshFunc = function() {};
	$('.navButton').css("font-weight", "normal");
	$('.discountsScreen').css("font-weight", "bold");
	// API call: request(resource, key, rqType, userInfoString, dataString, successFunc, errorFunc)
	request("discount", "", RequestType.READ, userInfo, "", buildDiscountScreen, buildDiscountScreen);
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
		if( validateDiscount(discountValue, discountValue) ){
			addDiscount(discountCode, discountValue, discountType);	
		}
		else{
			discountsScreen();
		}
		
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
		if( validateDiscount(discountValue, discountValue) ){
			updateDiscount(discountID, discountCode, discountValue, discountType);			
		}
		else {
			discountsScreen();
		}
	});
	
	$('.discountDeleteButton').click(function(){
		discountID = $(this).parents(".discount:first").find(".discountIdHolder").val();
		deleteDiscount(discountID);
	});
}

// Creates form to create new discount
function drawDiscountInput(){
	$('#page').append(
			'<div id="newDiscount" class="formButton discount addNewDiscount">'+
				'<input type="button" class="formButton discountButton addDiscountButton" value="Add"/>' +		
				'Create a new discount: <br/>' +
				'<div class="inputLabel">Code </div><input type="text" class="inputField discountCode" value=""/>' + '<br />' +
				'<div class="inputLabel">Value </div><input type="text" class="inputField discountValue" value=""/>'+  '<br />' +
				'<div class="inputLabel">Type </div>' + discountTypeSelector("Percent") +	
			'</div>');
}

function discountTypeSelector(selectedDiscountType){
	var selectCode = '<select class="inputField discountType" >';
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
			'<div id="discount' + discount.DiscountID + '" class="formButton discount">'+
					'<input type="hidden" class="discountIdHolder" value ="'+ discount.DiscountID + '"/>' +
					'<input type="button" class="formButton discountButton discountUpdateButton" value="Update"/>' +
					'<input type="button" class="formButton discountButton discountDeleteButton" value="Delete"/>' +
					'<div class="inputLabel">Code </div><input type="text" class="inputField discountCode" value="' + discount.DiscountCode + '"/>' + '<br />' + 
					'<div class="inputLabel">Value </div><input type="text" class="inputField discountValue" value="' + discount.Value + '"/>' + '<br />' + 
					'<div class="inputLabel">Type </div>' + discountTypeSelector(discount.Type) +
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

function validateDiscount(discountValue, discountValue){
	if(!isNumber(discountValue)){
		alert("Invalid discount value - discount must be a numerical value");
		return false;
	}
	else if(discountType == 'Percent' && (discountValue <= 0.009 || discountValue > 100) ){
		alert("Invalid discount value.  Percentage must be a numerical value between 0.01 and 100.");
		return false;
	}
	else if(discountType == 'Amount' && (discountValue <= 0 || discountValue > 999.99) ){
		alert("Invalid discount value.  Amount must be a numerical value between 0.01 and 999.99");
		return false;
	}
	else{
		return true;
	}
}

function discountErrorFunction(){
	discountsScreen();
}