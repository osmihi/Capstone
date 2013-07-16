<?php # RequestType.php - an 'enum' for request types

class RequestType {
	const CREATE = 1;
	const READ = 2;
	const UPDATE = 3;
	const DELETE = 4;
	
	public static function getRequestType($type) {
		$rqt = false;
		
		switch($type) {
			case 'POST':
			case 'post':
			case 'CREATE':
			case 'create':
				$rqt = RequestType::CREATE;
				break;
			case 'GET':
			case 'get':
			case 'READ':
			case 'read':
				$rqt = RequestType::READ;
				break;
			case 'PUT':
			case 'put':
			case 'UPDATE':
			case 'update':
				$rqt = RequestType::UPDATE;
				break;
			case 'DELETE':
			case 'delete':
				$rqt = RequestType::DELETE;
				break;
			default:
				$rqt = false;
				break;
		}
		
		return $rqt;
	}
}