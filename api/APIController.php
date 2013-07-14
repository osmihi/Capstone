<?php # APIController.php - Controller for API functions

	require_once('DbConnection.php');

	require_once('RequestType.php');
	require_once('Role.php');

	require_once('AccessMatrix.php');

	require_once('Resource.php');
	require_once('User.php');
	require_once('Restaurant.php');
	require_once('Table.php');
	require_once('WaitList.php');
	require_once('MenuItem.php');
	require_once('OrderItem.php');
	require_once('Order.php');
	require_once('Bill.php');
	require_once('Tip.php');
	require_once('Discount.php');
	require_once('Discounted.php');

	require_once('APIRequest.php');
	require_once('APIResponse.php');

class APIController {
	
	private $dbc;

	private $request;
	private $response;

	private $user;

	function __construct() {

		try {
			$this->response = new APIResponse();

			// this line is in here for testing only. setHeaders should be private and only called by APIResponse in respond()
			$this->response->setHeaders();

			$this->dbc = new DbConnection();

			$this->request = new APIRequest();

			$userInfo = $this->request->getUserInfo();

			if (!$userInfo) throw new Exception("No user info in request.", 400);

			$this->user = new User($this->dbc, $userInfo);

			if ( !$this->user->authenticate() ) throw new Exception("User not found.", 401);					

			if ( !$this->user->authorize($this->request) ) throw new Exception("User not authorized for requested action.", 403);
		
			//$this->response->respond();
					
			exit;

		} catch (Exception $e) {
			echo $e->getMessage();
		}
	}
}


