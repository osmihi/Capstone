<?php #Resource.php - abstract superclass for database objects

abstract class Resource {
	const USER = 1;
	const RESTAURANT = 2;
	const TABLE = 3;
	const WAITLIST = 4;
	const MENUITEM = 5;
	const ORDERITEM = 6;
	const ORDER = 7;
	const BILL = 8;
	const TIP = 9;
	const DISCOUNT = 10;
	const DISCOUNTED = 11;
	
	private static $rscMap = array(
		"user" => Resource::USER,
		"restaurant" => Resource::RESTAURANT,
		"table" => Resource::TABLE,
		"waitlist" => Resource::WAITLIST,
		"menuitem" => Resource::MENUITEM,
		"orderitem" => Resource::ORDERITEM,
		"order" => Resource::ORDER,
		"bill" => Resource::BILL,
		"tip" => Resource::TIP,
		"discount" => Resource::DISCOUNT,
		"discounted" => Resource::DISCOUNTED
	);
	
	protected $db;
	
	protected $keyName;

	// map param names to variable / database names
	protected $fieldMap;

	// required fields for each operation
	protected $createFields;
	protected $readFields;
	protected $updateFields;
	protected $deleteFields;

	function __construct(DbConnection $database) {
		$this->db = $database;
	}

	// loads a bunch of params into the corresponding fields on this object
	public function loadFields(array $params) {
		foreach ($params as $paramKey => $paramVal) {
			$fieldName = $this->getFieldName($paramKey);

			if ($fieldName) {
				$this->{$fieldName} = $paramVal;
			}
		}

		if ( isset($params['key']) ) {
			$this->{$this->keyName} = $params['key'];
		}
	}

	// gets the database field name of a given param name
	protected function getFieldName($paramKey) {
		foreach($this->fieldMap as $fieldKey => $fieldName) {
			if (strcasecmp($paramKey, $fieldKey) == 0) {
				return $fieldName;
			}
		}
		return false;
	}

	// Returns an array of all the database fields of this resource
	public function getFields() {
		$fields = array();
		foreach ($this->fieldMap as $key => $value) {
			if (isset($this->{$value})) {
				$fields[$value] = $this->{$value}; 
			}
		}
		return $fields;
	}

	// Gets a field by key name
	public function getField($key) {
		$field = false;
		$fieldName = $this->getFieldName($key);

		if (isset($this->{$fieldName})) {
			$field = $this->{$fieldName}; 
		}
		return $field;
	}

	// returns the value of this resource's primary key
	public function getPrimaryKey() {
		return $this->{$this->keyName};
	}

	// checks that a given set of params in the 2nd argument contains values for the fields in the 1st argument
	protected function verifyRequiredFields(array $requiredFields, array $params) {
		$verified = !empty($params);

		foreach ($requiredFields as $fieldName) {
			$fieldOk = false;
			if ($verified) {
				foreach ($params as $paramKey => $paramValue) {
					if (strcasecmp($fieldName,$paramKey) == 0) {
						$fieldOk = true;
					}
					$verified = $fieldOk;
				}
			}
		}

		return $verified;
	}

	// checks whether a single param (2nd arg) matches one of the keys in an array (1st arg)
	protected function verifyRequiredField(array $requiredFields, $paramKey) {
		foreach ($requiredFields as $fieldName) {
			if ( strcasecmp($fieldName, $paramKey) == 0 )
				return true;
		}
		return false;
	}

	// CRUD Operations
	
	public function create(array $params = array()) {
		$allFields = $params + $this->getFields();
		if (!$this->verifyRequiredFields($this->createFields, $allFields)) return false;

		$done = array();
		$fieldsList = array();
		$valuesList = array();

		foreach ($allFields as $fKey => $fVal) {
			if ($this->getFieldName($fKey)) {
				if ( !in_array($this->getFieldName($fKey), $done) ) {
					$fieldsList[] = $this->getFieldName($fKey);
					$valuesList[] = $fVal;
					$done[] = $this->getFieldName($fKey);
				}
			}
		}

		$stmt = $this->db->prepare("INSERT INTO `". get_class($this) . "` (" . QueryHelper::buildFieldsList($fieldsList) . ") VALUES (" . QueryHelper::buildBindList($fieldsList) . ")");
		for ($i = 0; $i < count($fieldsList); $i++) {
			$stmt->bindValue(':' . $fieldsList[$i] . 'Value', $valuesList[$i], Resource::getPDOParamType($valuesList[$i]));
		}

		$res = $this->db->executeInsert($stmt);

		if ( !$res ) return false;

		$fieldNames = "";
		$delim = "";
		foreach ($this->fieldMap as $f) {
			$fieldNames .= $delim . "`" . $f . "`";
			$delim = ", "; 
		}

		$stmt = $this->db->prepare("SELECT ". $fieldNames . " FROM `" . get_class($this) . "` WHERE `" . $this->keyName . "` = LAST_INSERT_ID()");

		$res = $this->db->execute($stmt);

		return $res;
	}

	public function read(array $params = array()) {
		$allFields = $params + $this->getFields();
		if ( !$this->verifyRequiredFields($this->readFields, $allFields) ) return false;

		$fieldNames = "";
		$delim = "";
		foreach ($this->fieldMap as $f) {
			$fieldNames .= $delim . "`" . $f . "`";
			$delim = ", "; 
		}

		$whereFields = "";
		$delim = " ";
		foreach ($this->readFields as $f) {
			$whereFields .= $delim . "`" . $f . "` = :" . $f . "Value ";
			$delim = " AND "; 
		}

		foreach ($params as $pKey => $pVal) {
			if ($this->getFieldName($pKey) && !$this->verifyRequiredField($this->readFields, $pKey)) {
				$whereFields .= $delim . "`" . $pKey . "` = :" . $pKey . "Value ";
			}
		}

		$stmt = $this->db->prepare("SELECT ". $fieldNames . " FROM `" . get_class($this) . "` WHERE " . $whereFields);
		foreach ($this->readFields as $f)
			$stmt->bindValue(':' . $f . "Value", $allFields[$f], Resource::getPDOParamType($allFields[$f]));
		foreach ($params as $pKey => $pVal) {
			if ($this->getFieldName($pKey) && !$this->verifyRequiredField($this->readFields, $pKey)) {
				$stmt->bindValue(':' . $pKey . "Value", $pVal, Resource::getPDOParamType($pVal));
			}
		}

		$res = $this->db->execute($stmt);

		return $res;
	}

	public function update(array $params = array()) {
		$allFields = $params + $this->getFields();
		if (!$this->verifyRequiredFields($this->updateFields, $allFields)) return false;
		return true;
	}

	public function delete(array $params = array()) {
		$allFields = $params + $this->getFields();
		if (!$this->verifyRequiredFields($this->deleteFields, $allFields)) return false;

		$done = array();
		$fieldsList = array();
		$valuesList = array();

		foreach ($allFields as $fKey => $fVal) {
			if ($this->getFieldName($fKey)) {
				if ( !in_array($this->getFieldName($fKey), $done) ) {
					$fieldsList[] = $this->getFieldName($fKey);
					$valuesList[] = $fVal;
					$done[] = $this->getFieldName($fKey);
				}
			}
		}

		$stmt = $this->db->prepare("DELETE FROM `". get_class($this) . "` WHERE " . QueryHelper::buildWhereList($fieldsList));
		for ($i = 0; $i < count($fieldsList); $i++) {
			$stmt->bindValue(':' . $fieldsList[$i] . 'Value', $valuesList[$i], Resource::getPDOParamType($valuesList[$i]));
		}

		$res = $this->db->executeInsert($stmt);

		var_dump($res);
		
		if ( !$res ) return false;		

		foreach ($this->fieldMap as $f) {
			$this->{$f} = null;
		}

		return true;
	}
	
	// Returns the object formatted as JSON data
	public function getJson() {
		$json  = "{" . PHP_EOL;
		$delim = "";
		foreach($this->fieldMap as $f) {
			$json .= $delim;
			$json .= "\t" . json_encode($f) . ":" . json_encode($this->{$f});
			$delim = "," . PHP_EOL;
		}
		$json .= PHP_EOL. "}" . PHP_EOL;

		return $json;
	}
	
	// Static methods
	
	public static function getResourceType($rsc) {
		$rscType = false;

		if (!is_string($rsc)) {
			$rsc = get_class($rsc);
		}

		foreach(self::$rscMap as $rscKey => $rscVal) {
			if ( strcasecmp($rsc, $rscKey) == 0 ) $rscType = $rscVal;
		}

		return $rscType;
	}
	
	public static function getResource($rscType, DbConnection $dbc, array $params) {
		if ($rscType){
			switch($rscType) {
				case Resource::USER:
					return new User($dbc, $params);
					break;
				case Resource::RESTAURANT:
					return new Restaurant($dbc, $params);
					break;
				case Resource::TABLE:
					return new Table($dbc, $params);
					break;
				case Resource::WAITLIST:
					return new WaitList($dbc, $params);
					break;
				case Resource::MENUITEM:
					return new MenuItem($dbc, $params);
					break;
				case Resource::ORDERITEM:
					return new OrderItem($dbc, $params);
					break;
				case Resource::ORDER:
					return new Order($dbc, $params);
					break;
				case Resource::BILL:
					return new Bill($dbc, $params);
					break;
				case Resource::TIP:
					return new Tip($dbc, $params);
					break;
				case Resource::DISCOUNT:
					return new Discount($dbc, $params);
					break;
				case Resource::DISCOUNTED:
					return new Discounted($dbc, $params);
					break;
				default:
					return false;
					break;
			}
		}
		return false;
	}

	public static function getPDOParamType($value) {
		if (strval(intval($value)) == $value)
			return PDO::PARAM_INT;
		elseif (is_bool($value))
			return PDO::PARAM_BOOL;
		elseif (is_null($value))
			return PDO::PARAM_NULL;
		elseif (is_string($value))
			return PDO::PARAM_STR;
		else 
			return false;
	}
}
