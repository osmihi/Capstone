<?php # User.php - Resource subclass for User

require_once('DbConnection.php');
require_once('RequestType.php');
require_once('Role.php');
require_once('Resource.php');
require_once('AccessMatrix.php');

class User extends Resource {

	protected $userID;
	protected $username;
	protected $passwordHash;
	protected $restaurantID;
	protected $role;
	protected $fName;
	protected $lName;
	
	function __construct(DbConnection $dbc, array $params) {
		parent::__construct($dbc);

		$this->keyName = 'UserID';
		
		$this->fieldMap = array(
			"userid" => "userID",
			"username" => "username",
			"password" => "passwordHash",
			"passwordhash" => "passwordHash",
			"restaurantid" => "restaurantID",
			"role" => "role",
			"fname" => "fName",
			"lname" => "lName"
		);

		parent::loadFields($params);
	}
	
	public function authenticate() {
		if ( !isset($this->username) || !isset($this->passwordHash) ) return false;

		$stmt = $this->db->prepare("SELECT `UserID`, `RestaurantID`, `Role`, `FName`, `LName` FROM `User` WHERE `Username` = :uname AND `PasswordHash` = :pwh LIMIT 0,1");
		$stmt->bindValue(':uname', $this->username, PDO::PARAM_STR);
		$stmt->bindValue(':pwh', $this->passwordHash, PDO::PARAM_STR);

		$res = $this->db->execute($stmt);

		if (count($res) < 1) {
			return false;
		} else {
			$this->userID = $res[0]['UserID'];
			$this->restaurantID = $res[0]['RestaurantID'];
			$this->role = $res[0]['Role'];
			$this->fName = $res[0]['FName'];
			$this->lName = $res[0]['LName'];
			return true;
		}
	}
	
	public function authorize(APIRequest $rq) {
		$role = Role::getRole($this->role);
		$rscType = $rq->getResourceType(); 
		$rqType = $rq->getRequestType();

		return AccessMatrix::authorize($role, $rscType, $rqType);
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
