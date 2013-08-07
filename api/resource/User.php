<?php # User.php - Resource subclass for User

class User extends Resource {

	// Database fields
	protected $UserID;
	protected $Username;
	protected $PasswordHash;
	protected $RestaurantID;
	protected $Role;
	protected $FName;
	protected $LName;
	protected $Locked;
	
	// Authorization
	private $authCode;

	function __construct(DbConnection $dbc, array $params) {
		parent::__construct($dbc);

		$this->keyName = 'UserID';

		$this->fieldMap = array(
			"userid" => "UserID",
			"username" => "Username",
			"password" => "PasswordHash",
			"passwordhash" => "PasswordHash",
			"restaurantid" => "RestaurantID",
			"role" => "Role",
			"fname" => "FName",
			"lname" => "LName",
			"locked" => "Locked"
		);

		// Required fields for each operation
		$this->createFields = array("Username", "PasswordHash", "RestaurantID", "Role", "FName", "LName");
 		$this->readFields = array("RestaurantID");
 		$this->updateFields = array("UserID", "RestaurantID");
 		$this->deleteFields = array("UserID", "RestaurantID");

		parent::loadFields($params);
		
		if (isset($params['authCode'])) $this->authCode = $params['authCode'];
	}

	public function create(array $params = array()) {
		$params = $this->hashPassword($params);
		$this->passwordHash = SHA1($this->passwordHash);
		return parent::create($params);
	}

	public function update(array $params = array()) {
		$params = $this->hashPassword($params);
		$this->passwordHash = SHA1($this->passwordHash);
		return parent::update($params);
	}

	private function hashPassword(array $params) {
		foreach($params as $pKey => $pVal) {
			if ($this->getFieldName($pKey) == 'PasswordHash') {
				$params[$pKey] = SHA1($pVal);
			}
		}
		
		return $params;
	}
	
	public function authenticate() {
		if ( !isset($this->authCode) && (!isset($this->Username) || !isset($this->PasswordHash)) ) return false;

		if ( isset($this->authCode) ) {
			
			$authArr = explode(":", $this->authCode, 2);
			$authID = substr($authArr[0],10);

			if ( strval( intval($authID) ) != $authID ) return false;

			$stmt = $this->db->prepare("SELECT `UserID`, `Username`, `PasswordHash`, `RestaurantID`, `Role`, `FName`, `LName` FROM `User` WHERE `UserID` = :uid LIMIT 0,1");
			$stmt->bindValue(':uid', $authID, PDO::PARAM_STR);

			$res = $this->db->execute($stmt);

			if (count($res) < 1) return false;

			$prefix = substr( md5(date("Y-m-d")), 0, 10 );

			//if ( $this->authCode != $prefix . $authID . ":" . SHA1($res[0]['Username'] . $res[0]['PasswordHash']) ) return false;
			if ( $authArr[1] != SHA1($res[0]['Username'] . $res[0]['PasswordHash']) ) return false;

		} else {
		
			$stmt = $this->db->prepare("SELECT `UserID`, `Username`, `PasswordHash`, `RestaurantID`, `Role`, `FName`, `LName` FROM `User` WHERE `Username` = :uname AND `PasswordHash` = SHA1(:pwh) AND `Locked` = 0 LIMIT 0,1");
			$stmt->bindValue(':uname', $this->Username, PDO::PARAM_STR);
			$stmt->bindValue(':pwh', $this->PasswordHash, PDO::PARAM_STR);

			$res = $this->db->execute($stmt);
	
			if (count($res) < 1) return false;
		}
		
		$this->UserID = $res[0]['UserID'];
		$this->Username = $res[0]['Username'];
		$this->PasswordHash = $res[0]['PasswordHash'];
		$this->RestaurantID = $res[0]['RestaurantID'];
		$this->Role = $res[0]['Role'];
		$this->FName = $res[0]['FName'];
		$this->LName = $res[0]['LName'];
		$this->Locked = $res[0]['Locked'];
		return true;
	
	}

	public function authorize(APIRequest $rq) {
		$role = Role::getRole($this->Role);
		$rscType = $rq->getResourceType(); 
		$rqType = $rq->getRequestType();

		return AccessMatrix::authorize($role, $rscType, $rqType);
	}
	
	// Returns the object formatted as JSON data (override to hide password)
	public function getJson() {
		$json  = "{" . PHP_EOL;
		$delim = "";
		foreach($this->fieldMap as $f) {
			if ($f != 'PasswordHash') {
				$json .= $delim;
				$json .= "\t" . json_encode($f) . ":" . json_encode($this->{$f});
				$delim = "," . PHP_EOL;
			}
		}
		$json .= PHP_EOL. "}";

		return $json;
	}
}
