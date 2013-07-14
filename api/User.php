<?php # User.php - Resource subclass for User

require_once('DbConnection.php');
require_once('RequestType.php');
require_once('Role.php');
require_once('Resource.php');
require_once('AccessMatrix.php');

class User extends Resource {

	private $userID;
	private $username;
	private $passwordHash;
	private $restaurantID;
	private $role;
	private $fName;
	private $lName;

	function __construct(DbConnection $dbc, array $params) {
		parent::__construct($dbc);

		$this->keyName = 'UserID';

		while ( $p = current($params) ) {
			$currentKey = key($params);

			switch ($currentKey) {
				case 'UserID':
				case 'userID':
					$this->userID = $p;
					break;
				case 'Username':
				case 'username':
				case 'UserName':
				case 'userName':
					$this->username = $p;
					break;
				case 'Password':
				case 'password':
				case 'PasswordHash':
				case 'passwordHash':
					$this->passwordHash = $p;
					break;
				case 'RestaurantID':
				case 'restaurantID':
					$this->restaurantID = $p;
					break;
				case 'Role':
				case 'role':
					$this->role = $p;
					break;
				case 'FName':
				case 'fName':
					$this->fName = $p;
					break;
				case 'LName':
				case 'lName':
					$this->lName = $p;
					break;
				default:
					break;
			}

			next($params);
		}
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
