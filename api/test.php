<!DOCTYPE html>

<html>
	<head>
		<title>test</title>
	</head>

	<body>
		<div id="page">

			<h3>random testing</h3>

			<p><?php
				echo 'Create: ' . RequestType::CREATE . '<br />' . PHP_EOL;
				echo 'Read: ' 	. RequestType::READ . '<br />' . PHP_EOL;
				echo 'Update: ' . RequestType::UPDATE . '<br />' . PHP_EOL;
				echo 'Delete: ' . RequestType::DELETE . '<br />' . PHP_EOL;
				
				
			
			?></p>

		</div> <!-- page -->
	</body>

</html>
