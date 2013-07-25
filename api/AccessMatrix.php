<?php # AccessMatrix.php - this class allows us to check what each role is allowed to do

class AccessMatrix {

	private	static $matrix = array(
		ResourceType::USER => array(
			Role::ADMINISTRATOR => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::MANAGER => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE),
			Role::WAIT_STAFF => array(RequestType::READ),
			Role::KITCHEN_STAFF => array(RequestType::READ),
			Role::HOSTESS => array(RequestType::READ)
		),
		ResourceType::RESTAURANT => array(
			Role::ADMINISTRATOR => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::MANAGER => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::WAIT_STAFF => array(RequestType::READ),
			Role::KITCHEN_STAFF => array(RequestType::READ),
			Role::HOSTESS => array(RequestType::READ)
		),
		ResourceType::TABLE => array(
			Role::ADMINISTRATOR => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::MANAGER => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::WAIT_STAFF => array(RequestType::READ),
			Role::KITCHEN_STAFF => array(RequestType::READ),
			Role::HOSTESS => array(RequestType::READ, RequestType::UPDATE)
		),
		ResourceType::WAITLIST => array(
			Role::ADMINISTRATOR => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::MANAGER => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::WAIT_STAFF => array(),
			Role::KITCHEN_STAFF => array(),
			Role::HOSTESS => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE)
		),
		ResourceType::MENUITEM => array(
			Role::ADMINISTRATOR => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::MANAGER => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::WAIT_STAFF => array(RequestType::READ),
			Role::KITCHEN_STAFF => array(RequestType::READ),
			Role::HOSTESS => array(RequestType::READ)
		),
		ResourceType::ORDERITEM => array(
			Role::ADMINISTRATOR => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::MANAGER => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::WAIT_STAFF => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::KITCHEN_STAFF => array(RequestType::READ,RequestType::UPDATE),
			Role::HOSTESS => array(RequestType::READ)
		),
		ResourceType::ORDER => array(
			Role::ADMINISTRATOR => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::MANAGER => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::WAIT_STAFF => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::KITCHEN_STAFF => array(RequestType::READ),
			Role::HOSTESS => array(RequestType::READ)
		),
		ResourceType::BILL => array(
			Role::ADMINISTRATOR => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::MANAGER => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::WAIT_STAFF => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::KITCHEN_STAFF => array(),
			Role::HOSTESS => array()
		),
		ResourceType::TIP => array(
			Role::ADMINISTRATOR => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::MANAGER => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::WAIT_STAFF => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::KITCHEN_STAFF => array(),
			Role::HOSTESS => array()
		),
		ResourceType::DISCOUNT => array(
			Role::ADMINISTRATOR => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::MANAGER => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
			Role::WAIT_STAFF => array(RequestType::READ),
			Role::KITCHEN_STAFF => array(),
			Role::HOSTESS => array()
		),
		ResourceType::DISCOUNTED => array(
			Role::ADMINISTRATOR => array(RequestType::CREATE, RequestType::READ, RequestType::UPDATE, RequestType::DELETE),
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
