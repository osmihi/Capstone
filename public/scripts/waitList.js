function waitListScreen() {
	request("waitlist", "", RequestType.READ, userInfo, "", buildWaitlistScreen);
}

function buildWaitlistScreen(response) {
	var waitLists = response.data;

	waitLists.sort(function(objA, objB) {
		if (objA.Timestamp < objB.Timestamp)
			return -1;
		else
			return 1;
	});

	$('#page').html("");

	for (i = 0; i < waitLists.length; i++) {
		drawWaitlist(waitLists[i]);
	}
}

function drawWaitlist(waitList) {
	$('#page').append(
			'<div id="waitList' + waitList.WaitListID + '" class="waitList">'
					+ 'Name: ' + waitList.Name + '<br />' + 'Size: '
					+ waitList.Size + '<br />' + 'Timestamp: '
					+ waitList.Timestamp + '<br />' + '</div>');

	$('#waitList' + waitList.WaitListID).click(function() {
		seatingScreen(waitList);
	});
}
