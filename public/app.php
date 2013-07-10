<!DOCTYPE html>

<html>
	<head>
		<title>OrDrUp</title>

		<script src="scripts/jquery-1.10.1.min.js" type="text/javascript"></script>

		<script src="employee.js" type="text/javascript"></script>

		<script>
			function loadScreen(pageName, dataObject, func) {
				$.ajax({
					url : pageName + '.html',
					success : function(data) {
						$('#page').html(data);
						func(dataObject);
					}
				});
			}

			var user = eval({
				'userID' : 5,
				'firstName' : 'Bootsy',
				'lastName' : 'Collins',
				'locked' : 'true'
			});

			$(function() {
				loadScreen('employee', user, employeeScreen);
			});

		</script>

	</head>

	<body>
		<div id="page">

		</div>
		<!-- page -->
	</body>
</html>
