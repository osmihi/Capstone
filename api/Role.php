<?php # Role.php - an 'enum' for user roles

class Role {
	const ADMINISTRATOR = 0;
	const MANAGER = 1;
	const WAIT_STAFF = 2;
	const KITCHEN_STAFF = 3;
	const HOSTESS = 4;
	
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
			case 'Hostess':
				$role = Role::HOSTESS;
				break;
			default:
				$role = false;
				break;
		}
		
		return $role;
	}
}