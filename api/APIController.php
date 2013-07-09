<?php # APIController.php - Controller for API functions

	require_once('DbConnection.php');
	require_once('RequestType.php');
	require_once('APIRequest.php');
	require_once('APIResponse.php');
	require_once('Resource.php');
	

class APIController {
	
	private $dbc;

	function __construct() {

		$this->dbc = new DbConnection();
		
		//$request = new APIRequest($_SERVER, $_REQUEST);

		//$response = new APIResponse($request);
	
		//$response->respond();
		
		include('test.php');
	
	}
}


