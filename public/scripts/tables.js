var tableCollection;

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

	tableCollection = tablesResponse.data;

	tableCollection.sort(function(a, b) {
		if (a.Number < b.Number) return -1;
		else return 1;
	});

	for ( i = 0; i < tableCollection.length; i++) {
		drawTableTable(tableCollection[i], buildTablesScreen.users);
	}
	
	if(userIsManagement()){
		drawAddTableForm();
	}
}

function drawTableTable(table, userData) {
	var userOptions = '<select id="table' + table.TableID + 'Assignee" class="tableAssigneeSelect">'
		+ '<option value="NULL"></option>';	
	
	for (var i = 0; i < userData.length; i++) {
		userOptions += '<option value="' + userData[i].UserID + '">' + userData[i].FName + ' ' + userData[i].LName + '</option>';
	}
	
	userOptions += '</select>';

	var billAction = userIsManagement() ? 'Edit' : 'View';
	
	var tableMarkup = '<div id="tableTables' + table.TableID + '" class="formButton tableTables">';
	  	if(userIsManagement()){tableMarkup += '<div id="table' + table.TableID + 'Delete" class="formButton tableDeleteButton">Delete</div>';}
	tableMarkup += 
	  	'<div id="table' + table.TableID + 'Bill" class="formButton billButton">' + billAction + ' Bill' + '</div>' +
		'<div id="table' + table.TableID + 'Status" class="formButton tableStatus ' + table.Status + '">' + table.Status + '</div>' +
		'<div class="tableName">Table ' + table.Number + ' </div>' + 
		'<div class="tableCapacity">Capacity: ' + table.Capacity + '</div>' + 
		'<div class="tableAssignee">Assignee: ' + userOptions + '</div>' +
	'</div>'

	$('#page').append(tableMarkup);

	$('#table' + table.TableID + 'Assignee option[value="' + table.UserID + '"]').attr("selected", "selected");
	
	$('#table' + table.TableID + 'Status').click(function() {
		var newValue = $(this).html() == 'Available' ? 'Occupied' : 'Available';

		if (table.Status == 'Occupied' && table.Paid == '0') {
			alert('Bill has not been paid yet.');
		} else {
			request("table", table.TableID, RequestType.UPDATE, userInfo, "Status=" + newValue, tablesScreen);
		}
	});
	
	$('#table' + table.TableID + 'Assignee').change(function() {
		request("table", table.TableID, RequestType.UPDATE, userInfo, "UserID=" + $(this).val(), function(response) {});
	});

	$('#table' + table.TableID + 'Bill').click(function() {
		selectedTable = table;
		if (table.Status == 'Occupied') {
			billScreen();
		} else {
			alert('No one is seated at this table.');
		}
	});
	
	$('#table' + table.TableID + 'Delete').click(function() {
		request("table", table.TableID, RequestType.DELETE, userInfo, 'ID='+table.TableID, tablesScreen);
	});
}

function drawAddTableForm(){
	var addTableMarkup = 
		'<div id="addNewTableForm" class="formButton tableTables">' +
			'Add a new table to this restaurant.' +
			'<div id="newTableName">Table ' + (tableCollection.length + 1) + ' </div>' + 
			'<div class="newTableCapacity">Capacity: <input type="text" id="newTableCapacityInput" value="" maxlength="2" size="3"/></div>' + 
			'<div id="addNewTableButton" class="formButton">Add Table</div>' +
		'</div>'
	$('#page').append(addTableMarkup);
	
	$('#addNewTableButton').click(function() {
		var createQuery = 'Capacity='+$('#newTableCapacityInput').val()+'&Number='+(tableCollection.length + 1)+'&Status=Available&Paid=0';	
		request("table", "", RequestType.CREATE, userInfo, createQuery, tablesScreen);
	});
}

function userIsManagement(){
	return(userRole == 'Manager' || userRole == 'Administrator');
}
