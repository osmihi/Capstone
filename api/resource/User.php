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

		parent::loadFields($params);
	}
	
	public function authenticate() {
		if ( !isset($this->Username) || !isset($this->PasswordHash) ) return false;

		$stmt = $this->db->prepare("SELECT `UserID`, `RestaurantID`, `Role`, `FName`, `LName` FROM `User` WHERE `Username` = :uname AND `PasswordHash` = :pwh AND `Locked` = 0 LIMIT 0,1");
		$stmt->bindValue(':uname', $this->Username, PDO::PARAM_STR);
		$stmt->bindValue(':pwh', $this->PasswordHash, PDO::PARAM_STR);

		$res = $this->db->execute($stmt);

		if (count($res) < 1) {
			return false;
		} else {
			$this->UserID = $res[0]['UserID'];
			$this->RestaurantID = $res[0]['RestaurantID'];
			$this->Role = $res[0]['Role'];
			$this->FName = $res[0]['FName'];
			$this->LName = $res[0]['LName'];
			$this->Locked = $res[0]['Locked'];
			return true;
		}
	}
	
	public function authorize(APIRequest $rq) {
		$role = Role::getRole($this->Role);
		$rscType = $rq->getResourceType(); 
		$rqType = $rq->getRequestType();

		return AccessMatrix::authorize($role, $rscType, $rqType);
	}
}
