<?php # Role.php - an 'enum' for user roles

class Role {
	const ADMINISTRATOR = 1;
	const MANAGER = 2;
	const WAIT_STAFF = 3;
	const KITCHEN_STAFF = 4;
	const HOSTESS = 5;
	
	public static function getRole($roleStr) {
		$role = false;

		switch ($roleStr) {
			case 'Administrator':
				$role = Role::ADMINISTRATOR;
				break;
			case 'Manager':
				$role = Role::MANAGER;
				break;
			case 'Wait Staff':
				$role = Role::WAIT_STAFF;
				break;
			case 'Kitchen Staff':
				$role = Role::KITCHEN_STAFF;
				break;
			case 'Host':
				$role = Role::HOSTESS;
				break;
			default:
				$role = false;
				break;
		}
		
		return $role;
	}
}