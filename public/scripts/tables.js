
function tablesScreen() {
	refreshFunc = function() {};
	
	$('.navButton').css("font-weight", "normal");
	$('.tablesScreen').css("font-weight", "bold");
	
	request("user", "", RequestType.READ, userInfo, "role=Wait Staff", 
		function(response) {
			buildTablesScreen.users = response.data;
			request("table", "", RequestType.READ, userInfo, "", buildTablesScreen);
		}
	);
	
	refreshFunc = function() {
		request("user", "", RequestType.READ, userInfo, "role=Wait Staff", 
			function(response) {
				buildTablesScreen.users = response.data;
				request("table", "", RequestType.READ, userInfo, "", buildTablesScreen);
			}
		);
	};
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
	var userOptions = '<select id="table' + table.TableID + 'Assignee" class="tableAssigneeSelect">'
		+ '<option value="NULL"></option>';	
	
	for (var i = 0; i < userData.length; i++) {
		userOptions += '<option value="' + userData[i].UserID + '">' + userData[i].FName + ' ' + userData[i].LName + '</option>';
	}
	
	userOptions += '</select>';

	var billAction = userRole == 'Manager' || userRole == 'Administrator' ? 'Edit' : 'View';
	
	// TODO modify this to put in buttons for stuff	
	$('#page').append(
		'<div id="tableTables' + table.TableID + '" class="formButton tableTables">' +
			'<div id="table' + table.TableID + 'Bill" class="formButton billButton">' + billAction + ' Bill' + '</div>' +
			'<div id="table' + table.TableID + 'Status" class="formButton tableStatus ' + table.Status + '">' + table.Status + '</div>' +
			'<div class="tableName">Table ' + table.Number + ' </div>' + 
			'<div class="tableCapacity">Capacity: ' + table.Capacity + '</div>' + 
			'<div class="tableAssignee">Assignee: ' + userOptions + '</div>' +
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

	$('#table' + table.TableID + 'Bill').click(function() {
		selectedTable = table;
		billScreen();
	});
}