<?php 
	require_once('APIRequest.php');
	require_once('APIResponse.php');

	$request = new APIRequest($_SERVER, $_REQUEST);

	$response = new APIResponse($request);
	
	$response->respond();
?>