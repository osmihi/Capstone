<html>
	<body>
		<?php 
			$response = "";
			$response .= "<html>" . PHP_EOL;
			$response .= "\t<body>" .PHP_EOL;
			$response .= "\t\t<p>" . PHP_EOL . "\t\t\t" . $_SERVER['REQUEST_URI'] . PHP_EOL . "\t\t</p>" . PHP_EOL;
			$response .= "\t\t<p>" . PHP_EOL . "\t\t\t";
			var_dump($_GET);
			$response .= PHP_EOL . "\t\t</p>" . PHP_EOL;
			$response .= "\t</body>" . PHP_EOL;
			$response .= "</html>" . PHP_EOL;
			echo $response;
		?>
	</body>
</html>
