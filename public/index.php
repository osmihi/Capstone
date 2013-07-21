<!DOCTYPE html>

<html>
	<head>
		<title>OrDrUp</title>

		<script src="scripts/jquery-1.10.1.min.js" type="text/javascript"></script>

		<!-- <script src="employee.js" type="text/javascript"></script> -->

		<style>
			.waitList {
				border: 2px solid purple;
				padding: 5px;
				margin: 5px;
				background-color: orange;
				width: 220px;
				font-family: Verdana, Arial, Helvetica, sans-serif;
				font-size: 90%;
				line-height: 1.2em;
			}
			
			.tableSeating {
				border: 2px solid yellow;
				padding: 5px;
				margin: 5px;
				background-color: pink;
				width: 220px;
				font-family: Verdana, Arial, Helvetica, sans-serif;
				font-size: 90%;
				line-height: 1.2em;
			}
			
			.tableSeating.Available {
				background-color:green;
			}
			
			.tableSeating.Occupied {
				background-color:lightGray;
			}
		</style>

		<script>

			var userInfo = "auth_Username=joe.smith&auth_Password=password";
			var selectedParty = "";

			RequestType = {
				CREATE : "POST",
				READ : "GET",
				UPDATE : "PUT",
				DELETE : "DELETE"
			}

			function request(resource, key, rqType, userInfoString, dataString, successFunc, errorFunc) {
				if (key == null)
					key = "";

				$.ajax({
					url : "http://api.ordrupapp.com/" + resource + "/" + key,
					type : rqType,
					data : userInfoString + "&" + dataString,
					error : function(response, textStatus, errorThrown) {
						errorFunc(response, textStatus, errorThrown);
					},
					success : function(response) {
						successFunc(response);
					}
				});
			}

			function loadScreen(pageName, dataObject, func) {
				$.ajax({
					url : pageName + '.html',
					success : function(data) {
						$('#page').html(data);
						func(dataObject);
					}
				});
			}

			/*
			 var user = eval({
			 'userID' : 5,
			 'firstName' : 'Bootsy',
			 'lastName' : 'Collins',
			 'locked' : 'true'
			 });
			 */

			function sortByTimestamp(objA, objB) {
				if ( objA.Timestamp > objB.Timestamp ) return -1;
				else return 1; 
			}

			function buildWaitlistScreen(response) {
				var waitLists = response.data;

				waitLists.sort(sortByTimestamp);

				$('#page').html("");

				for ( i = 0; i < waitLists.length; i++) {
					drawWaitlist(waitLists[i]);
				}
			}

			function drawWaitlist(waitList) {
				$('#page').append(
					'<div id="waitList' + waitList.WaitListID + '" class="waitList">' + 
						'Name: ' + waitList.Name + '<br />' + 
						'Size: ' + waitList.Size + '<br />' + 
						'Timestamp: ' + waitList.Timestamp + '<br />' + 
					'</div>'
				);

				$('#waitList' + waitList.WaitListID).click(function() {
					seatingScreen(waitList);
				});
			}

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
					drawTable(tables[i]);
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
			
			function drawTable(table) {
				var userString = $.isNumeric(table.UserID) ? table.UserID : "None";
				
				$('#page').append(
					'<div id="tableSeating' + table.TableID + '" class="tableSeating ' + table.Status + '">' + 
						'Number: ' + table.Number + '<br />' + 
						'Capacity: ' + table.Capacity + '<br />' + 
						'Status: ' + table.Status + '<br />' +
						'Assignee: <span class="assigneeUserID">' + userString + '</span><br />' + 
					'</div>'
				);

				$('#tableSeating' + table.TableID).click(function() {
					request("table", table.TableID, RequestType.UPDATE, userInfo, "status=Occupied", function() {
						request("waitlist", selectedParty.WaitListID, RequestType.DELETE, userInfo, "", waitListScreen, function() {
							request("table", table.TableID, RequestType.UPDATE, userInfo, "status=Available", waitListScreen);
						});
					});
				});
			}

			function waitListScreen() {
				request("waitlist", "", RequestType.READ, userInfo, "", buildWaitlistScreen);
			}

			$(function() {
				waitListScreen();

				//loadScreen('employee', user, employeeScreen);
			});

		</script>

	</head>

	<body>
		<div id="page">

		</div>
		<!-- page -->
	</body>
</html>
