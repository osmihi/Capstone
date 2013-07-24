<?php # QueryHelper.php - a silly class to help write query strings

class QueryHelper {

	private function __construct() {}

	// Takes an array and makes it a backtick-quoted, comma separated list
	public static function buildFieldsList(array $fieldNames, $tableName = null, $continue = false) {
		$list = "";
		$quote = "`";
		$delim = $continue ? ", " : "";
		$table = $tableName != null ? '`' . $tableName . '`.' : '';
		
		foreach ($fieldNames as $f) {
				$list .= $delim . $table . $quote . $f . $quote;
				$delim = ", ";	
		}

		return $list;
	}

	// Takes an array and makes it a backtick-quoted, comma separated list
	public static function buildBindList(array $fieldNames) {
		$list = "";
		$delim = "";

		foreach ($fieldNames as $f) {
				$list .= $delim . ":" . $f . 'Value';
				$delim = ", ";
		}

		return $list;
	}
	
	public static function buildValuesList(array $values, $continue = false) {
		$list = "";
		$quote = "'";
		$delim = $continue ? ", " : "";

		foreach ($values as $v) {
			if ( is_numeric($v) ) {
				$list .= $delim . $v;
			} else {
				$list .= $delim . $quote . $v . $quote;
			}
			$delim = ", ";	
		}

		return $list;
	}
	
	public static function buildWhereList(array $fields, $tableName = null, $continue = false) {
		$list = "";
		$delim = $continue ? " AND " : "";
		$table = $tableName != null ? '`' . $tableName . '`.' : '';

		if (empty($fields)) $list .= " 1 = 1 ";

		foreach ($fields as $f) {
			$list .= $delim . $table . '`' . $f . '` = :' . $f . 'Value ';
			$delim = " AND ";
		}

		return $list;
	}
	
	public static function buildUpdateValuesList(array $fields, $continue = false) {
		$list = "";
		$delim = $continue ? ", " : "";
		
		foreach ($fields as $f) {
			$list .= $delim . '`' . $f . '` = :' . $f . 'Value ';
			$delim = ", ";	
		}

		return $list;
	} 
}
