<?php # APIController.php - Controller for API functions

	require_once('AccessMatrix.php');
	
	require_once('APIRequest.php');
	require_once('APIResponse.php');
	
	require_once('DbConnection.php');
	
	require_once('RequestType.php');
	require_once('Resource.php');
	require_once('Role.php');
	require_once('User.php');
	

class APIController {
	
	private $dbc;

	function __construct() {

		$this->dbc = new DbConnection();
		
		//$request = new APIRequest($_SERVER, $_REQUEST);

		//$response = new APIResponse($request);
	
		//$response->respond();
		
		//include('test.php');
		
		$stmt = $this->dbc->prepare("SELECT * FROM `Restaurant` LIMIT :start,:number");
		$stmt->bindValue(':start', 0, PDO::PARAM_INT);
		$stmt->bindValue(':number', 10, PDO::PARAM_INT);
		
		$res = $this->dbc->execute($stmt);
		
		echo "<pre>" . PHP_EOL;
		
		foreach ($res as $r) {
			echo $r['RestaurantID'] . ": " . $r['Name'] . "<br />" . PHP_EOL;
		}
		
		echo "Can manager read tables? " . AccessMatrix::authorize(Role::MANAGER,Resource::TABLE,RequestType::READ) . PHP_EOL;

		echo "Can wait staff delete restaurant? " . AccessMatrix::authorize(Role::WAIT_STAFF,Resource::RESTAURANT,RequestType::DELETE) . PHP_EOL;
		
		echo "Can wait staff read waitlist? " . AccessMatrix::authorize(Role::WAIT_STAFF,Resource::WAITLIST,RequestType::READ) . PHP_EOL;
		
		echo "Can hostess read waitlist? " . AccessMatrix::authorize(Role::HOSTESS,Resource::WAITLIST,RequestType::READ) . PHP_EOL;
		
		echo "</pre>" . PHP_EOL;
		
		
	
	}
}


