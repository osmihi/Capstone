<?php # LoginController.php - Handles the login

require_once('APIController.php');

class LoginController {

	private $dbc;

	private $request;
	private $response;	

	private $user;

	function __construct() {
		
		try {
			$this->response = new APIResponse();

			$this->response->setHeaders(); // for debugging

			$this->dbc = new DbConnection();
			
			$this->request = new APIRequest();

			if ( !$this->request->getRequestType() ) throw new Exception("Invalid request type:" . $_SERVER['REQUEST_METHOD'], 200);

			// Verify that user credentials were provided in the request
			$userInfo = $this->request->getUserInfo();

			if ( !$userInfo ) throw new Exception("No user info in request.", 400);

			$this->user = new User($this->dbc, $userInfo);

			// Make sure the user has the proper credentials
			if ( !$this->user->authenticate() ) throw new Exception("Username / password not found.", 401);					

			if ( intval($this->user->getField('Locked')) != 0 ) throw new Exception("Account locked.", 403);

			if ( session_id() == '' ) session_start();

			$prefix = substr( md5(date("Y-m-d")), 0, 10 );

			$_SESSION['authCode'] = $prefix . $this->user->getField('UserID') . ":" . SHA1($this->user->getField('Username') . $this->user->getField('PasswordHash'));
			$_SESSION['userRole'] = $this->user->getField('Role');

			$authCodeJson = "{" . "\"authCode\" : " . json_encode($_SESSION['authCode']) . "}";
			
			$this->response->addData($authCodeJson);
			$this->response->addData($this->user->getJson());
			
			$this->response->setStatusCode(202);
			$this->response->setMessage("Logged in.");

		} catch(Exception $e) {
			$this->response->setStatusCode($e->getCode());
			$this->response->setMessage($e->getMessage());
		}
		
		$this->response->respond();

		exit;
	}
	
	public static function logOut() {
		if ( session_id() == '' ) {
			session_start();
		}
		
		session_destroy();

		unset($_SESSION['authCode']);
		
		$response = new APIResponse();

		$response->setStatusCode(202);
		$response->setMessage("Logged out.");

		$response->respond();

		exit;
	}
}