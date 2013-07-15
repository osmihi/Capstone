<?php # APIController.php - Controller for API functions

	require_once('DbConnection.php');

	require_once('RequestType.php');
	require_once('Role.php');

	require_once('AccessMatrix.php');

	require_once('resource/Resource.php');
	require_once('resource/User.php');
	require_once('resource/Restaurant.php');
	require_once('resource/Table.php');
	require_once('resource/WaitList.php');
	require_once('resource/MenuItem.php');
	require_once('resource/OrderItem.php');
	require_once('resource/Order.php');
	require_once('resource/Bill.php');
	require_once('resource/Tip.php');
	require_once('resource/Discount.php');
	require_once('resource/Discounted.php');

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

			if ( !$this->user->authenticate() ) throw new Exception("Username / password not found.", 401);					

			if ( !$this->user->authorize($this->request) ) throw new Exception("User not authorized for requested action.", 403);

			$this->request->addParam("RestaurantID", $this->user->getField('RestaurantID'));

			// test code
			$wl = new WaitList($this->dbc, $this->request->getParams());

			echo "create(): ";
			var_dump($wl->create());
			echo "read(): ";
			var_dump($wl->read());
			echo "update(): ";
			var_dump($wl->update());
			echo "delete(): ";
			var_dump($wl->delete());

			//$this->response->respond();
					
			exit;

		} catch (Exception $e) {
			echo $e.getCode() . ': ' . $e->getMessage();
		}
	}
}


