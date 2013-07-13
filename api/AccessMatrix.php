<?php # AccessMatrix.php - this class allows us to check what each role is allowed to do

require_once('RequestType.php');
require_once('Role.php');
require_once('Resource.php');

class AccessMatrix {

	private	static $matrix = array(
		Resource::USER => array(
			Role::ADMIN => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::MANAGER => array(RequestType::READ, RequestType::UPDATE),
			Role::WAIT_STAFF => array(),
			Role::KITCHEN_STAFF => array(),
			Role::HOSTESS => array()
		),
		Resource::RESTAURANT => array(
			Role::ADMIN => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::MANAGER => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::WAIT_STAFF => array(RequestType::READ),
			Role::KITCHEN_STAFF => array(RequestType::READ),
			Role::HOSTESS => array(RequestType::READ)
		),
		Resource::TABLE => array(
			Role::ADMIN => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::MANAGER => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::WAIT_STAFF => array(RequestType::READ),
			Role::KITCHEN_STAFF => array(RequestType::READ),
			Role::HOSTESS => array(RequestType::READ, RequestType::UPDATE)
		),
		Resource::WAITLIST => array(
			Role::ADMIN => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::MANAGER => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::WAIT_STAFF => array(),
			Role::KITCHEN_STAFF => array(),
			Role::HOSTESS => array(RequestType::READ, RequestType::UPDATE)
		),
		Resource::MENUITEM => array(
			Role::ADMIN => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::MANAGER => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::WAIT_STAFF => array(RequestType::READ),
			Role::KITCHEN_STAFF => array(RequestType::READ),
			Role::HOSTESS => array(RequestType::READ)
		),
		Resource::ORDERITEM => array(
			Role::ADMIN => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::MANAGER => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::WAIT_STAFF => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::KITCHEN_STAFF => array(RequestType::READ,RequestType::UPDATE),
			Role::HOSTESS => array(RequestType::READ)
		),
		Resource::ORDER => array(
			Role::ADMIN => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::MANAGER => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::WAIT_STAFF => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::KITCHEN_STAFF => array(RequestType::READ),
			Role::HOSTESS => array(RequestType::READ)
		),
		Resource::BILL => array(
			Role::ADMIN => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::MANAGER => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::WAIT_STAFF => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::KITCHEN_STAFF => array(),
			Role::HOSTESS => array()
		),
		Resource::TIP => array(
			Role::ADMIN => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::MANAGER => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::WAIT_STAFF => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::KITCHEN_STAFF => array(),
			Role::HOSTESS => array()
		),
		Resource::DISCOUNT => array(
			Role::ADMIN => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::MANAGER => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::WAIT_STAFF => array(RequestType::READ),
			Role::KITCHEN_STAFF => array(),
			Role::HOSTESS => array()
		),
		Resource::DISCOUNTED => array(
			Role::ADMIN => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::MANAGER => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::WAIT_STAFF => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::KITCHEN_STAFF => array(),
			Role::HOSTESS => array()
		)
	);

	public static function authorize($role, $rsc, $rqType) {
		$authorized = false;

		foreach (AccessMatrix::$matrix[$rsc][$role] as $access) {
			if ($access == $rqType) {
				$authorized = true;
			}
		}
		
		return $authorized;
	}
}
