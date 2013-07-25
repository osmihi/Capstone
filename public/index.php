<?php session_start();?>

<!DOCTYPE html>

<html>
	<head>
		<title>OrDrUp</title>

		<link rel=stylesheet type="text/css" href="styles/styles.css">

		<script src="scripts/jquery-1.10.1.min.js" type="text/javascript"></script>
		<script src="scripts/common.js" type="text/javascript"></script>
		<script src="scripts/navBar.js" type="text/javascript"></script>
		<script src="scripts/waitList.js" type="text/javascript"></script>
		<script src="scripts/seating.js" type="text/javascript"></script>
		<script src="scripts/tables.js" type="text/javascript"></script>
		<script src="scripts/discounts.js" type="text/javascript"></script>

		<script>

			userInfo = "<?php if (isset($_SESSION['authCode'])) echo 'authCode=' . $_SESSION['authCode']?>";
			userID = "<?php if (isset($_SESSION['authCode'])) echo $_SESSION['UserID']?>";
			userRole = "<?php if (isset($_SESSION['authCode'])) echo $_SESSION['userRole']?>";

			NavInitial = new Array();
			NavInitial['Manager'] = ["tablesScreen"];
			NavInitial['Host'] = ["waitListScreen"];
			NavInitial['Wait Staff'] = ["tablesScreen"];
			NavInitial['Kitchen Staff'] = ["orderQueueScreen"];

			$(function() {

				navBar();

				if (userRole != '')	{window[NavInitial[userRole]]();}

			});

		</script>

	</head>

	<body>
		<div id="header"></div>
		<div id="page"></div>
	</body>
</html>