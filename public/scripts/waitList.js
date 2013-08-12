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
		//Wipe page clean (remove previous existing content)
		$('#page').html("");
		if(waitLists == null){
			$('#page').html("<h2>There are currently no parties in the wait list</h2>");
		}
		else{
			//Sort waitLists in descending order by timestamp (oldest time stamp first) 
			if(waitLists.length > 1){
				waitLists.sort(function(objA, objB) {
					if (objA.Timestamp < objB.Timestamp)
						return -1;
					else
						return 1;
				});	
			}
		}
			
		//Form to add party to wait list 
		drawAddToWaitListForm();
		
		//Iterate through waitLists, call drawWaitlist for each party
		for (i = 0; i < waitLists.length; i++) {
			drawWaitlist(waitLists[i]);
		}		
	}
}

//Creates box containing party information  
function drawAddToWaitListForm() {
	//Add a div with inputs to enter a new party
	$('#page').append(
			'<div id="addToWaitListForm" class="formButton addToWaitListForm">'
						+'<div class="waitListLabel waitListNameLabel">Party Name </div>' 
						+'<input type="text" id="partyNameInput" class="inputField" value=""/>'
						+'<div class="waitListLabel waitListSizeLabel"> Size </div>'
						+'<input type="text" id="partySizeInput" class="inputField" value="" maxlength="2"/>'
				+'<input type=button id="addPartyButton" class="formButton" value="Add"/>'
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
	var thisDate = new Date(waitList.Timestamp);

	//Add div with party waitlist info to page div  
	$('#page').append(
			'<div id="waitList' + waitList.WaitListID + '" class="formButton waitList">' +
				'<div id="waitListSelect' + waitList.WaitListID + '" class="formButton waitListSelectBtn">Select</div>' +
				'<div id="waitListDelete' + waitList.WaitListID + '"class="formButton waitListDeleteBtn">X</div>' +
				'<div class="waitListLabel waitListName">' + waitList.Name + '</div>' +  
				'<div class="waitListLabel waitListSize">Party of ' + waitList.Size + '</div>' +
				'<div class="waitListLabel waitListTimestamp">Waiting since ' + thisDate.toLocaleTimeString() + '</div>' +
			'</div>');

	//Add click function to waitlist div - show seating screen
	$('#waitListSelect' + waitList.WaitListID).click(function() {
		partyIsSelected = true;
		seatingScreen(waitList);
	});
	
	//Add click function to waitlist delete button
	$('#waitListDelete' + waitList.WaitListID).click(function() {
		var isSure =confirm("Are you sure you want to delete this party?");
		if(isSure){
			console.log(waitList);			
			request("waitList", waitList.WaitListID, RequestType.DELETE, userInfo, 'ID='+waitList.WaitListID, waitListScreen);			
		}
	});
}
