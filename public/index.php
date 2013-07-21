<!DOCTYPE html>

<html>
	<head>
		<title>OrDrUp</title>

		<link rel=stylesheet type="text/css" href="styles/styles.css">

		<script src="scripts/jquery-1.10.1.min.js" type="text/javascript"></script>
		<script src="scripts/common.js" type="text/javascript"></script>
		<script src="scripts/waitList.js" type="text/javascript"></script>
		<script src="scripts/seating.js" type="text/javascript"></script>

		<script>

			$(function() {
				var role = "";
				while (role == "") {
					role = prompt("Enter role: \n(Manager, Host, Wait Staff, Kitchen Staff)", "Host");

					switch (role) {
						case "Manager":
						case "manager":
							userInfo = "auth_Username=bootsy.collins&auth_Password=password";
							// screen function here
							break;
						case "Host":
						case "Hostess":
						case "host":
						case "hostess":
							userInfo = "auth_Username=joe.smith&auth_Password=password";
							waitListScreen();
							break;
						case "Wait Staff":
						case "wait staff":
						case "waitStaff":
						case "WaitStaff":
							userInfo = "auth_Username=q.tip&auth_Password=password";
							// screen function here
							break;
						case "Kitchen Staff":
						case "kitchen staff":
						case "kitchenStaff":
						case "KitchenStaff":
							userInfo = "auth_Username=nate.dogg&auth_Password=password";
							// screen function here
							break;
						default:
							role = "";
							break;
					}
				}
			});

		</script>

	</head>

	<body>
		<div id="page">

		</div>
		<!-- page -->
	</body>
</html>
