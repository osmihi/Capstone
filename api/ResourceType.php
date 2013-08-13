<?php # ResourceType.php - an 'enum' for resource types and useful static functions

class ResourceType {
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
		"user" => ResourceType::USER,
		"restaurant" => ResourceType::RESTAURANT,
		"table" => ResourceType::TABLE,
		"waitlist" => ResourceType::WAITLIST,
		"menuitem" => ResourceType::MENUITEM,
		"orderitem" => ResourceType::ORDERITEM,
		"order" => ResourceType::ORDER,
		"bill" => ResourceType::BILL,
		"tip" => ResourceType::TIP,
		"discount" => ResourceType::DISCOUNT,
		"discounted" => ResourceType::DISCOUNTED
	);
	
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
				case ResourceType::USER:
					return new User($dbc, $params);
					break;
				case ResourceType::RESTAURANT:
					return new Restaurant($dbc, $params);
					break;
				case ResourceType::TABLE:
					return new Table($dbc, $params);
					break;
				case ResourceType::WAITLIST:
					return new WaitList($dbc, $params);
					break;
				case ResourceType::MENUITEM:
					return new MenuItem($dbc, $params);
					break;
				case ResourceType::ORDERITEM:
					return new OrderItem($dbc, $params);
					break;
				case ResourceType::ORDER:
					return new Order($dbc, $params);
					break;
				case ResourceType::BILL:
					return new Bill($dbc, $params);
					break;
				case ResourceType::TIP:
					return new Tip($dbc, $params);
					break;
				case ResourceType::DISCOUNT:
					return new Discount($dbc, $params);
					break;
				case ResourceType::DISCOUNTED:
					return new Discounted($dbc, $params);
					break;
				default:
					return false;
					break;
			}
		}
		return false;
	}

	public static function getPDOParamType($value, $fieldName = null) {
		if ( $fieldName != null && $fieldName == 'Paid' ) 
			return PDO::PARAM_BOOL;
		elseif (strval(intval($value)) == $value)
			return PDO::PARAM_INT;
		elseif (is_bool($value) )
			return PDO::PARAM_BOOL;
		elseif (is_null($value))
			return PDO::PARAM_NULL;
		elseif (strcasecmp($value, 'NULL') == 0)
			return PDO::PARAM_NULL;
		elseif (is_string($value))
			return PDO::PARAM_STR;
		else 
			return false;
	}
	
}