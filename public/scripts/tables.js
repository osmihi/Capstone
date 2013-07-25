// tables screen will show all the tables at the restaurant
// each has a status-- different color
// user can:
// clear status (change occupied to available)
// set the assignee
// create a new table, if manager
// go to bill page

function tablesScreen() {
	request("table", "", RequestType.READ, userInfo, "", buildTablesScreen)
}

function buildTablesScreen(response) {
	$('#page').html("");

	var tables = response.data;

	tables.sort(function(a, b) {
		if (a.Number < b.Number) return -1;
		else return 1;
	});

	for ( i = 0; i < tables.length; i++) {
		drawTableTables(tables[i]);
	}

	// note: fillInWaitStaff is defined in seating.js
	request("user", "", RequestType.READ, userInfo, "role=Wait Staff", fillInWaitStaff);
}

function drawTableTables(table) {
	var userString = $.isNumeric(table.UserID) ? table.UserID : "None";

	// TODO modify this to put in buttons for stuff	
	$('#page').append(
		'<div id="tableTables' + table.TableID + '" class="tableTables ' + table.Status + '">' + 
			'Number: ' + table.Number + '<br />' + 
			'Capacity: ' + table.Capacity + '<br />' + 
			'Status: <span class="tableStatus>' + table.Status + '</span><br />' +
			'Assignee: <span class="assigneeUserID">' + userString + '</span><br />' + 
		'</div>'
	);

	// TODO make click functions for various buttons in there above...
}