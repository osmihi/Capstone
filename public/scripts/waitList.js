//Called to render waitList screen
function waitListScreen() {
	partyIsSelected = false;
	refreshFunc = function() {};
	
	$('.navButton').css("font-weight", "normal");
	$('.waitListScreen').css("font-weight", "bold");
	
	//API call: request(resource, key, rqType, userInfoString, dataString, successFunc, errorFunc)
	request("waitlist", "", RequestType.READ, userInfo, "", buildWaitListScreen, buildWaitListScreen);
}

//response is result of API request call
function buildWaitListScreen(response) {
	var waitLists = new Array();

	if (response.statusCode == "200") {
		waitLists = response.data;
	
	//Sort waitLists in descending order by timestamp (oldest time stamp first) 
		waitLists.sort(function(objA, objB) {
			if (objA.Timestamp < objB.Timestamp)
				return -1;
			else
				return 1;
		});
	}
	
	//Wipe page clean (remove previous existing content)
	$('#page').html("");

	//Form to add party to wait list 
	drawAddToWaitListForm();
	
	//Iterate through waitLists, call drawWaitlist for each party
	for (i = 0; i < waitLists.length; i++) {
		drawWaitlist(waitLists[i]);
	}
}

//Creates box containing party information  
function drawAddToWaitListForm() {
	//Add a div with inputs to enter a new party
	$('#page').append(
			'<div id="addToWaitListForm"  class="addToWaitListForm">'
				+'<table>'
					+'<tr>' 
						+'<td> Party Name: </td>' 
						+'<td><input type="text" id="partyNameInput" value=""/></td>'
					+'</tr>'
					+'<tr>'
						+'<td> Party Size </td>'
						+'<td><input type="text" id="partySizeInput" value="" maxlength="2" style="width:30px"/></td>'
					+'</tr>'
				+'</table>'
				+'<input type=button id="addPartyButton" value="Add"/><br />'
			+'</div>');

	//Add click function to button
	$('#addPartyButton').click(function() {
		addPartyToWaitList();
	});
}

function addPartyToWaitList(){
	var partyName = $('#partyNameInput').val();
	var partySize = $('#partySizeInput').val();
	request("waitlist", "", RequestType.CREATE, userInfo, "Name="+partyName+"&Size="+partySize, waitListScreen);
}

//Creates box containing party information
function drawWaitlist(waitList) {
	//Add div with party waitlist info to page div  
	$('#page').append(
			'<div id="waitList' + waitList.WaitListID + '" class="waitList">'
					+ 'Name: ' + waitList.Name + '<br />' 
					+ 'Size: ' + waitList.Size + '<br />' 
					+ 'Timestamp: ' + waitList.Timestamp + '<br />' +
			'</div>');

	//Add click function to waitlist div - show seating screen
	$('#waitList' + waitList.WaitListID).click(function() {
		partyIsSelected = true;
		seatingScreen(waitList);
	});
}
