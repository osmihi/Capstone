<?php # APIRequest.php - represents a request made via the API

require_once('RequestType.php');

class APIRequest {
	private $requestURI;
	private $requestMethod;
	private $requestType;
	private $resourceType;
	private $key;
	private $params = array();

	public function __construct($svr, $rq) {
		$this->requestURI = $svr['REQUEST_URI'];
		$this->requestMethod = $svr['REQUEST_METHOD'];

		switch ($svr['REQUEST_METHOD']) {
			case "POST":
				$this->requestType = RequestType::CREATE;
				break;
			case "GET":
				$this->requestType = RequestType::READ;
				break;
			case "PUT":
				$this->requestType = RequestType::UPDATE;
				break;
			case "DELETE":
				$this->requestType = RequestType::DELETE;
				break;
			default:
				break;
		}

		$this->resourceType = $rq['resource'];

		if ( isset($rq['key']) && preg_match("/([0-9]+)/", $rq['key']) ) {
			$this->key = $rq['key'];
		} else {
			$this->key = 0;
		}
		
		$this->buildParams($rq);
	}

	private function buildParams($rq) {
		while ( $r = current($rq) ) {
			$this->addParam(key($rq), $r);
			next($rq);
		}
	}

	public function getResourceType() {
		return $this->resourceType;
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
	
	public function jsonSerialize() {
        return array(
        	'jsonSupport' => 'isSadlyNot',
        	'implemented' => 'yet'
        );
    }
}
