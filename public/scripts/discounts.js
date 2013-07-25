/**
 * @author Othman
 * 
 * like users get all discounts foreach discount, make a div that contains:
 * unique id (use discount id on end)
 * 
 * 
 */
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

	// Iterate through waitLists, call drawWaitlist for each party
	for (i = 0; i < discounts.length; i++) {
		drawDiscount(discounts[i]);
	}
	
	//Add click function to button
	$('.discountUpdateButton').click(function() {
		alert($(this).parents(".discount:first").attr("id"))
		discountCode = $(this).parents(".discount:first").find(".discountCode").val();
		discountValue = $(this).parents(".discount:first").find(".discountValue").val();
		discountID = $(this).parents(".discount:first").find(".discountIdHolder").val();
		alert(discountCode);
		alert(discountValue);
		alert(discountID);
	});
}

// Creates box containing party information
function drawDiscount(discount) {
	// Add div with party waitlist info to page div
	$('#page').append(
			'<div id="discount' + discount.DiscountID + '" class="discount">'+
					'<input type="hidden" class="discountIdHolder" value ="'+ discount.DiscountID + '"/><br/>' +
					'Code: <input type="text" class="discountCode" value="' + discount.DiscountCode + '"/><br />' + 
					'Value: <input type="text" class="discountValue" value="' + discount.Value + '"/><br />' +
					'<input type="button" class="discountUpdateButton" value="Update"/>' +
			'</div>');

}




