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
	
	protected $db;

	protected $keyName;

	function __construct(DbConnection $database) {
		$this->db = $database;
	}

	public function process($requestType, $params) {
		
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

		switch($rsc) {
			case 'User':
			case 'user':
				$rscType = Resource::USER;
				break;
			case 'Restaurant':
			case 'restaurant':
				$rscType = Resource::RESTAURANT;
				break;
			case 'Table':
			case 'table':
				$rscType = Resource::TABLE;
				break;
			case 'WaitList':
			case 'Waitlist':
			case 'waitList':
			case 'waitlist':
				$rscType = Resource::WAITLIST;
				break;
			case 'MenuItem':
			case 'Menuitem':
			case 'menuItem':
			case 'menuitem':
				$rscType = Resource::MENUITEM;
				break;
			case 'OrderItem':
			case 'Orderitem':
			case 'orderItem':
			case 'orderitem':
				$rscType = Resource::ORDERITEM;
				break;
			case 'Order':
			case 'order':
				$rscType = Resource::ORDER;
				break;
			case 'Bill':
			case 'bill':
				$rscType = Resource::BILL;
				break;
			case 'Tip':
			case 'tip':
				$rscType = Resource::TIP;
				break;
			case 'Discount':
			case 'discount':
				$rscType = Resource::DISCOUNT;
				break;
			case 'Discounted':
			case 'discounted':
				$rscType = Resource::DISCOUNTED;
				break;
			default:
				$rscType = false;
				break;
		}
		
		return $rscType;
	}
}
