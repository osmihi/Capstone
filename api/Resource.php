<?php #Resource.php - abstract superclass for database objects

require_once('DbConnection.php');
require_once('RequestType.php');

abstract class Resource {
	const USER = 0;
	const RESTAURANT = 1;
	const TABLE = 2;
	const WAITLIST = 3;
	const MENUITEM = 4;
	const ORDERITEM = 5;
	const ORDER = 6;
	const BILL = 7;
	const TIP = 8;
	const DISCOUNT = 9;
	const DISCOUNTED = 10;
	
	private static $rscMap = array(
		"user" => Resource::USER,
		"restaurant" => Resource::RESTAURANT,
		"table" => Resource::TABLE,
		"waitlist" => Resource::WAITLIST,
		"menuitem" => Resource::MENUITEM,
		"orderitem" => Resource::ORDERITEM,
		"bill" => Resource::BILL,
		"tip" => Resource::TIP,
		"discount" => Resource::DISCOUNT,
		"discounted" => Resource::DISCOUNTED
	);
	
	protected $db;
	
	protected $keyName;
	
	protected $fieldMap;

	function __construct(DbConnection $database) {
		$this->db = $database;
	}

	public function process($requestType, $params) {
		
	}
	
	public function loadFields(array $params) {
		foreach ($params as $paramKey => $paramVal) {
			foreach($this->fieldMap as $fieldKey => $fieldName) {
				if (strcasecmp($paramKey, $fieldKey) == 0) {
					$this->{$fieldName} = $paramVal;
				}
			}
		}
	}
	
	abstract protected function create($params);

	abstract protected function read($params);

	abstract protected function update($params);

	abstract protected function delete($params);

	abstract protected function jsonSerialize();
	
	public static function getResourceType($rsc) {
		$rscType = false;

		if (!is_string($rsc)) {
			$rsc = get_class($rsc);
		}

		foreach(self::$rscMap as $rscKey => $rscVal) {
			if ( strcasecmp($rsc, $rscKey) == 0 ) $rscType == $rscVal;
		}

		return $rscType;
	}
}
