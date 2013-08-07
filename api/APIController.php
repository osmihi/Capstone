<?php # APIController.php - Controller for API functions

	require_once('DbConnection.php');

	require_once('ResourceType.php');
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
	
	require_once('QueryHelper.php');

class APIController {
	
	private $dbc;

	private $request;
	private $response;

	private $user;

	function __construct() {

		try {
			$this->response = new APIResponse();

//			$this->response->setHeaders(); // for debugging

			// Connect to the database
			$this->dbc = new DbConnection();

			$this->request = new APIRequest();
			
			if ( !$this->request->getRequestType() ) throw new Exception("Invalid request type:" . $_SERVER['REQUEST_METHOD'], 200);

			if ( !$this->request->getResourceType() ) throw new Exception("Invalid resource requested.", 400);

			// Verify that user credentials were provided in the request
			$userInfo = $this->request->getUserInfo();
			if ( !$userInfo ) throw new Exception("No user info in request.", 400);

			$this->user = new User($this->dbc, $userInfo);

			// Make sure the user has the proper credentials
			if ( !$this->user->authenticate() ) throw new Exception("Username / password not found.", 401);					

			// Make sure the user has permission to perform the request action on the requested resource type
			if ( !$this->user->authorize($this->request) ) throw new Exception("User not authorized for requested action.", 403);

			// Add the user's RestaurantID to the list of params
			$this->request->addParam("RestaurantID", $this->user->getField('RestaurantID'));
			
			// Create the resource
			$rsc = false;
			$rsc = ResourceType::getResource($this->request->getResourceType(), $this->dbc, $this->request->getParams());	

			if ( !$rsc ) throw new Exception("Error creating resource.", 400);

			// Carry out the request on the resource
			$result = false;

			switch($this->request->getRequestType()) {
				case RequestType::CREATE;
					if ( $this->request->getKey() > 0 ) throw new Exception("Invalid request. Do not provide an ID for the resource being created.", 400);
					$result = $rsc->create($this->request->getParams());
					break;
				case RequestType::READ;
					$result = $rsc->read($this->request->getParams());
					break;
				case RequestType::UPDATE;
					$result = $rsc->update($this->request->getParams());
					break;
				case RequestType::DELETE;
					$result = $rsc->delete($this->request->getParams());
					break;
				default:
					$result = false;
					break; 
			}

			if ( !$result ) throw new Exception("The request could not be carried out. The selected resource may not exist, or all required fields may not have been provided.", 206);

			foreach($result as $r) {
				$this->response->addData($r->getJson());
			}
			
		} catch (Exception $e) {
			$this->response->setStatusCode($e->getCode());
			$this->response->setMessage($e->getMessage());
			if ($e->getCode() == 206) {
				$this->response->addData($rsc->getRequiredFieldsJson());
			}
		}

		$this->response->respond();

		exit;

	}
}
