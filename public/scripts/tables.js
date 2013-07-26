// tables screen will show all the tables at the restaurant
// each has a status-- different color
// user can:
// clear status (change occupied to available)
// set the assignee
// create a new table, if manager
// go to bill page

function tablesScreen() {
	request("user", "", RequestType.READ, userInfo, "role=Wait Staff", 
		function(response) {
			buildTablesScreen.users = response.data;
			request("table", "", RequestType.READ, userInfo, "", buildTablesScreen);
		}
	);
}

function buildTablesScreen(tablesResponse) {
	$('#page').html("");

	var tables = tablesResponse.data;

	tables.sort(function(a, b) {
		if (a.Number < b.Number) return -1;
		else return 1;
	});

	for ( i = 0; i < tables.length; i++) {
		drawTableTable(tables[i], buildTablesScreen.users);
	}

}

function drawTableTable(table, userData) {
	var userOptions = '<select id="table' + table.TableID + 'Assignee" class="tableAssignee">'
		+ '<option value="NULL"></option>';	
	
	for (var i = 0; i < userData.length; i++) {
		userOptions += '<option value="' + userData[i].UserID + '">' + userData[i].Username + '</option>';
	}
	
	userOptions += '</select>';

	var billAction = userRole == 'Manager' || userRole == 'Administrator' ? 'Edit' : 'View';
	
	// TODO modify this to put in buttons for stuff	
	$('#page').append(
		'<div id="tableTables' + table.TableID + '" class="tableTables ' + table.Status + '">' + 
			'Number: ' + table.Number + '<br />' + 
			'Capacity: ' + table.Capacity + '<br />' + 
			'Status: <span id="table' + table.TableID + 'Status" class="tableStatus">' + table.Status + '</span><br />' +
			'Assignee:' + userOptions + '<br />' + 
			'<div id="table' + table.TableID + 'Bill">' + billAction + ' Bill' + '</div>' +
		'</div>'
	);

	$('#table' + table.TableID + 'Assignee option[value="' + table.UserID + '"]').attr("selected", "selected");
	
	$('#table' + table.TableID + 'Status').click(function() {
		var newValue = $(this).html() == 'Available' ? 'Occupied' : 'Available';

		request("table", table.TableID, RequestType.UPDATE, userInfo, "Status=" + newValue, function(response) {
			$('#table' + table.TableID + 'Status').html(response.data[0].Status);
			if ($('#tableTables' + table.TableID).hasClass('Available')) {
				$('#tableTables' + table.TableID).removeClass('Available');
				$('#tableTables' + table.TableID).addClass('Occupied');
			} else {
				$('#tableTables' + table.TableID).removeClass('Occupied');
				$('#tableTables' + table.TableID).addClass('Available');
			}
		});
	});
	
	$('#table' + table.TableID + 'Assignee').change(function() {
		request("table", table.TableID, RequestType.UPDATE, userInfo, "UserID=" + $(this).val(), function(response) {});
	});
	
	// TODO make click functions for various buttons in there above...
}