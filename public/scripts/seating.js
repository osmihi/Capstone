function seatingScreen(waitList) {
	selectedParty = waitList;
	request("table", "", RequestType.READ, userInfo, ""/*"status=Available"*/, buildSeatingScreen);
}

function buildSeatingScreen(response) {
	$('#page').html("");

	var tables = response.data;

	tables.sort(function(a, b) {
		if (a.Number < b.Number) return -1;
		else return 1;
	});

	for ( i = 0; i < tables.length; i++) {
		drawTableSeating(tables[i]);
	}

	request("user", "", RequestType.READ, userInfo, "role=Wait Staff", fillInWaitStaff);
}

function fillInWaitStaff(response) {
	$('.assigneeUserID').each(function () {
		for (i = 0; i < response.data.length; i++) {
			if ( this.innerHTML == response.data[i].UserID ) {
				this.innerHTML = response.data[i].FName + " " + response.data[i].LName; 
			}
		}
	});
}

function drawTableSeating(table) {
	var userString = $.isNumeric(table.UserID) ? table.UserID : "None";

	$('#page').append(
		'<div id="tableSeating' + table.TableID + '" class="tableSeating ' + table.Status + '">' + 
			'Number: ' + table.Number + '<br />' + 
			'Capacity: ' + table.Capacity + '<br />' + 
			'Status: ' + table.Status + '<br />' +
			'Assignee: <span class="assigneeUserID">' + userString + '</span><br />' + 
		'</div>'
	);

	$('#tableSeating' + table.TableID + ".Available").click(function() {
		request("table", table.TableID, RequestType.UPDATE, userInfo, "status=Occupied", function() {
			request("waitlist", selectedParty.WaitListID, RequestType.DELETE, userInfo, "", waitListScreen, function() {
				request("table", table.TableID, RequestType.UPDATE, userInfo, "status=Available", waitListScreen);
			});
		});
	});
}
