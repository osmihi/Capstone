<?php # User.php - Resource subclass for User

require_once('DbConnection.php');
require_once('RequestType.php');
require_once('Role.php');
require_once('Resource.php');
require_once('AccessMatrix.php');

class User extends Resource {

	private $UserID;
	private $Username;
	private $PasswordHash;
	private $RestaurantID;
	private $Role;
	private $FName;
	private $LName;

	function __construct(DbConnection $dbc, $id) {
		super($dbc);

		$this->validFields[] = 'UserID';
		$this->validFields[] = 'Username';
		$this->validFields[] = 'PasswordHash';
		$this->validFields[] = 'RestaurantID';
		$this->validFields[] = 'Role';
		$this->validFields[] = 'FName';
		$this->validFields[] = 'LName';

		$this->keyName = 'UserID';

		$this->UserID = $id;
	}
	
	public function authenticate() {
		
	}
	
	public function authorize(Resource $rsc, $rqType) {
		// remember, you can use get_class here on the resource
	}
	
	// Inherited methods
	
	public function create($params) {
		
	}
	
	public function read($params) {
		
	}
	
	public function update($params) {
		
	}
	
	public function delete($params) {
		
	}
	
	public function jsonSerialize() {
		
	}
}
