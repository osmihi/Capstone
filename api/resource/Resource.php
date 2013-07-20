<?php #Resource.php - abstract superclass for database objects

abstract class Resource {
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

		if ( isset($params['key']) && $params['key'] != 0 ) {
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
		if (empty($requiredFields)) return true;
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
		if (empty($requiredFields)) return true;
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
			$stmt->bindValue(':' . $fieldsList[$i] . 'Value', $valuesList[$i], ResourceType::getPDOParamType($valuesList[$i]));
		}

		$res = $this->db->executeInsert($stmt);

		if ( !$res ) return false;

		$fieldNames = "";
		$delim = "";
		foreach ($this->fieldMap as $f) {
			$fieldNames .= $delim . "`" . $f . "`";
			$delim = ", "; 
		}

		$stmt = $this->db->prepare("SELECT ". $fieldNames . " FROM `" . get_class($this) . "` WHERE `" . $this->keyName . "` = LAST_INSERT_ID() LIMIT 0,1");

		$res = $this->db->execute($stmt);

		if ( !$res or count($res) < 1 ) return false;

		$resources = array();

		$this->loadFields($res[0]);

		foreach( $res as $r ) {
			$currentRsc = ResourceType::getResource(ResourceType::getResourceType($this), $this->db, array());
			$currentRsc->loadFields($r);
			$resources[] = $currentRsc;
		}

		return $resources;
	}

	public function read(array $params = array()) {
		$allFields = $params + $this->getFields();
		if ( !$this->verifyRequiredFields($this->readFields, $allFields) ) return false;

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

		$stmt = $this->db->prepare("SELECT ". QueryHelper::buildFieldsList(array_unique($this->fieldMap)) . " FROM `" . get_class($this) . "` WHERE " . QueryHelper::buildWhereList($fieldsList));
		for ($i = 0; $i < count($fieldsList); $i++) {
			$stmt->bindValue(':' . $fieldsList[$i] . 'Value', $valuesList[$i], ResourceType::getPDOParamType($valuesList[$i]));
		}

		$res = $this->db->execute($stmt);

		if ( !$res or count($res) < 1 ) return false;

		$resources = array();

		$this->loadFields($res[0]);

		foreach( $res as $r ) {
			$currentRsc = ResourceType::getResource(ResourceType::getResourceType($this), $this->db, array());
			$currentRsc->loadFields($r);
			$resources[] = $currentRsc;
		}

		return $resources;
	
	}

	public function update(array $params = array()) {
		$allFields = $params + $this->getFields();
		if (!$this->verifyRequiredFields($this->updateFields, $allFields)) return false;

		$done = array();
		$fieldsList = array();
		$valuesList = array();
		
		$reqFieldsList = array();
		$reqValuesList = array();
		
		foreach ($allFields as $fKey => $fVal) {
			if ( $this->getFieldName($fKey) && !in_array($this->getFieldName($fKey), $done) ) {
				if ( $this->verifyRequiredField($this->updateFields, $this->getFieldName($fKey)) ) {
					$reqFieldsList[] = $this->getFieldName($fKey);
					$reqValuesList[] = $fVal;
				} else {
					$fieldsList[] = $this->getFieldName($fKey);
					$valuesList[] = $fVal;
				}
				$done[] = $this->getFieldName($fKey);
			}
		}

		$stmt = $this->db->prepare("UPDATE `". get_class($this) . "` SET " . QueryHelper::buildUpdateValuesList($fieldsList) . " WHERE " . QueryHelper::buildWhereList($reqFieldsList));
		for ($i = 0; $i < count($fieldsList); $i++) {
			$stmt->bindValue(':' . $fieldsList[$i] . 'Value', $valuesList[$i], ResourceType::getPDOParamType($valuesList[$i]));
		}
		for ($i = 0; $i < count($reqFieldsList); $i++) {
			$stmt->bindValue(':' . $reqFieldsList[$i] . 'Value', $reqValuesList[$i], ResourceType::getPDOParamType($reqValuesList[$i]));
		}

		$res = $this->db->executeInsert($stmt);
		
		if ( $stmt->rowCount() < 1 ) return false;

		$fieldNames = "";
		$delim = "";
		foreach ($this->fieldMap as $f) {
			$fieldNames .= $delim . "`" . $f . "`";
			$delim = ", "; 
		}

		$stmt = $this->db->prepare("SELECT ". $fieldNames . " FROM `" . get_class($this) . "` WHERE " . QueryHelper::buildWhereList($reqFieldsList));
		for ($i = 0; $i < count($reqFieldsList); $i++) {
			$stmt->bindValue(':' . $reqFieldsList[$i] . 'Value', $reqValuesList[$i], ResourceType::getPDOParamType($reqValuesList[$i]));
		}

		$res = $this->db->execute($stmt);

		if ( !$res or count($res) < 1 ) return false;

		$resources = array();

		$this->loadFields($res[0]);

		foreach( $res as $r ) {
			$currentRsc = ResourceType::getResource(ResourceType::getResourceType($this), $this->db, array());
			$currentRsc->loadFields($r);
			$resources[] = $currentRsc;
		}

		return $resources;
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
			$stmt->bindValue(':' . $fieldsList[$i] . 'Value', $valuesList[$i], ResourceType::getPDOParamType($valuesList[$i]));
		}

		$res = $this->db->executeInsert($stmt);

		if ( !$res or count($res) < 1 ) return false;

		$resources = array();

		foreach ($this->fieldMap as $f) {
			$this->{$f} = null;
		}

		$resources[] = $this;

		return $resources;
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
		$json .= PHP_EOL. "}";

		return $json;
	}
	
	public function getRequiredFieldsJson() {
		$json  = "{" . PHP_EOL;
		$json .= "\t\"create\"\t:\t" . json_encode($this->createFields) . PHP_EOL;
		$json .= "\t\"read\"\t\t:\t" . json_encode($this->readFields) . PHP_EOL;
		$json .= "\t\"update\"\t:\t" . json_encode($this->updateFields) . PHP_EOL;
		$json .= "\t\"delete\"\t:\t" . json_encode($this->deleteFields) . PHP_EOL;
		$json .= "}";

		return $json;
	}
}
