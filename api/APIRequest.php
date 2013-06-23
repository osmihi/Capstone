<?php # APIRequest.php - represents a request made via the API

class RequestType {
	const CREATE = 0;
	const READ = 1;
	const UPDATE = 2;
	const DELETE = 3;

	private function __construct() {}
}

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
	

	
	public function toString() {
		$toStr = "\t\t\t<table>" . PHP_EOL;
		$toStr .= "\t\t\t\t<tr>" . PHP_EOL . "\t\t\t\t\t<td>type</td>". PHP_EOL . "\t\t\t\t\t<td>" . $this->type . "</td>" . PHP_EOL . "\t\t\t\t</tr>" . PHP_EOL;
		while ($p = current($this->params)) {
			$toStr .= "\t\t\t\t<tr>" . PHP_EOL;	
			$toStr .= "\t\t\t\t\t<td>" . key($this->params) . "</td>" . PHP_EOL . "\t\t\t\t\t<td>" . $p . "</td>" . PHP_EOL;
			$toStr .= "\t\t\t\t<tr>" . PHP_EOL;
			next($this->params);
		}
		$toStr .= "\t\t\t</table>" . PHP_EOL;
		return $toStr;
	}
}
