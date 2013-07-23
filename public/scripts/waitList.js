//Called to render waitList screen
function waitListScreen() {
	//API call: request(resource, key, rqType, userInfoString, dataString, successFunc, errorFunc)
	request("waitlist", "", RequestType.POST, userInfo, "", buildWaitlistScreen);
}

//response is result of API request call
function buildWaitlistScreen(response) {
	var waitLists = response.data;

//Sort waitLists in descending order by timestamp (oldest time stamp first) 
	waitLists.sort(function(objA, objB) {
		if (objA.Timestamp < objB.Timestamp)
			return -1;
		else
			return 1;
	});

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
					+ 
					'<table>'+
					'<tr>' +
					'<td> Party Name: </td>' +
					'<td><input type="text" id="partyNameInput" value=""/></td>'+
				'</tr>'+
				'<tr>'+
					'<td> Party Size </td>'+
					'<td><input type="text" id="partySizeInput" value="" maxlength="2" style="width:30px"/></td>'+
				'</tr>'+
			'</table>'
					+ '<input type=button id="addPartyButton" value="Add"/><br />'+
			'</div>');

	//Add click function to button
	$('#addPartyButton').click(function() {
		addPartyToWaitList();
	});
}

function addPartyToWaitList(){
	var partyName = $('#partyNameInput').val();
	alert("partyName: "+partyName);
	var partySize = $('#partySizeInput').val();
	alert("partySize"+ partySize);
	request("waitlist", "", RequestType.PUT, userInfo, "Name="+partyName+"&Size="+partySize, buildWaitlistScreen);
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
		seatingScreen(waitList);
	});
}
