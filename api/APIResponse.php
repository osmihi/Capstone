<?php #APIResponse.php - builds a response from an API request

class APIResponse {
	private $contentType = "application/json";
	private $statusCode = 200;

	private $message;
	private $data;

	function __construct() {}

	public function respond() {
		$this->setHeaders();

		echo $this->getJson();

		exit;
	}
	
	public function getJson() {
		$json = "";
		$json .= "{" . PHP_EOL;
		$json .= "\t\"currentTimestamp\":\"" . date(DATE_RFC822) . "\"," . PHP_EOL;
		$json .= "\t\"statusCode\":\"" . $this->statusCode . "\"," . PHP_EOL;
		$json .= "\t\"status\":\"" . $this->getStatusMessage($this->statusCode) . "\"," . PHP_EOL;
		$json .= "\t\"message\":\"" . $this->message . "\"," . PHP_EOL;
		
		if ($this->data != "") {
			$json .= "\t\"data\":[";
			$json .= $this->data . PHP_EOL;
			$json .= "\t]" . PHP_EOL;
		}
		
		$json .= "}";	
		return $json;
	}
	
	public function addData(Resource $rsc) {
		$this->data .= $this->data == "" ? "" : "," . PHP_EOL;

		foreach ( explode(PHP_EOL, $rsc->getJson()) as $line ) {
			$this->data .= PHP_EOL . "\t\t" . $line;
		}
	}
	
	public function setMessage($msg) {
		$this->message = $msg;
	}

	public function setHeaders() {
		// Note: this code allows cross-server requests from anywhere. To restrict, we should 
		// enclose this block in a condition checking $_SERVER['HTTP_ORIGIN'] against a whitelist.
   		{
   			header('Access-Control-Allow-Origin: '.$_SERVER['HTTP_ORIGIN']);
   			header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS');
   			header('Access-Control-Max-Age: 1000');
   			header('Access-Control-Allow-Headers: Content-Type');
		}

		header( "HTTP/1.1 " . $this->statusCode . " " . $this->getStatusMessage($this->statusCode) );
		header( "Content-Type:" . $this->contentType );
	}

	public function setStatusCode($code) {
		$this->statusCode = $code;
	}

	public function getStatusMessage($code) {
		$statusCodes = array(
			100 => 'Continue',  
			101 => 'Switching Protocols',  
			200 => 'OK',
			201 => 'Created',  
			202 => 'Accepted',  
			203 => 'Non-Authoritative Information',  
			204 => 'No Content',  
			205 => 'Reset Content',  
			206 => 'Partial Content',  
			300 => 'Multiple Choices',  
			301 => 'Moved Permanently',  
			302 => 'Found',  
			303 => 'See Other',  
			304 => 'Not Modified',  
			305 => 'Use Proxy',  
			306 => '(Unused)',  
			307 => 'Temporary Redirect',  
			400 => 'Bad Request',  
			401 => 'Unauthorized',  
			402 => 'Payment Required',  
			403 => 'Forbidden',  
			404 => 'Not Found',  
			405 => 'Method Not Allowed',  
			406 => 'Not Acceptable',  
			407 => 'Proxy Authentication Required',  
			408 => 'Request Timeout',  
			409 => 'Conflict',  
			410 => 'Gone',  
			411 => 'Length Required',  
			412 => 'Precondition Failed',  
			413 => 'Request Entity Too Large',  
			414 => 'Request-URI Too Long',  
			415 => 'Unsupported Media Type',  
			416 => 'Requested Range Not Satisfiable',  
			417 => 'Expectation Failed',  
			500 => 'Internal Server Error',  
			501 => 'Not Implemented',  
			502 => 'Bad Gateway',  
			503 => 'Service Unavailable',  
			504 => 'Gateway Timeout',  
			505 => 'HTTP Version Not Supported'
		);

		return ($statusCodes[$code]) ? $statusCodes[$code] : $statusCodes[500];
	}
}
