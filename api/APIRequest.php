<?php # APIRequest.php - represents a request made via the API

class APIRequest {
	private $requestURI;
	private $requestMethod;
	private $requestType;
	private $resource;
	private $resourceType;
	private $key;
	private $params = array();

	public function __construct() {
		$this->requestURI = $_SERVER['REQUEST_URI'];
		$this->requestMethod = $_SERVER['REQUEST_METHOD'];

		$this->requestType = RequestType::getRequestType($_SERVER['REQUEST_METHOD']);

		$this->resource = $_REQUEST['resource'];
		$this->resourceType = ResourceType::getResourceType($this->resource);

		if ( isset($_REQUEST['key']) && preg_match("/([0-9]+)/", $_REQUEST['key']) ) {
			$this->key = $_REQUEST['key'];
		} else {
			$this->key = 0;
		}

		$this->buildParams($_REQUEST);

		// Special procedure needed to obtains PUT or DELETE parameters
		if ( $this->requestType == RequestType::UPDATE || $this->requestType == RequestType::DELETE ) {
			parse_str(file_get_contents("php://input"),$putParams);
			$this->buildParams($putParams);
		}

	}

	private function buildParams($rq) {
		foreach ($rq as $k => $v) {
			$this->addParam($k, $v);
		}
	}

	public function getParams() {
		return $this->params;
	}

	public function getUserInfo() {
		$userInfo = array();
		
		if ($this->hasParam('auth_Username') && $this->hasParam('auth_Password')) {
			$userInfo['Username'] = $this->getParam('auth_Username');

			$userInfo['Password'] = $this->getParam('auth_Password');

		} elseif ( $this->hasParam('authCode') ) {
			$userInfo['authCode'] = $this->getParam('authCode');

		} else return false;

		return $userInfo;
	}

	public function getResource() {
		return $this->resource;
	}
	
	public function getResourceType() {
		return $this->resourceType;
	}
	
	public function getRequestType() {
		return $this->requestType;
	}

	public function getKey() {
		return $this->key;
	}

	public function getParam($key) {
		if (isset($this->params[$key])) {
			return $this->params[$key];
		} else {
			return false;
		}
	}
	
	public function hasParam($key) {
		if (isset($this->params[$key])) {
			return true;
		} else {
			return false;
		}
	}

	public function addParam($key, $value) {
		if (!isset($this->params[$key])) {
			$this->params[$key] = $value;
			return true;
		} else {
			return false;
		}
	}
}
