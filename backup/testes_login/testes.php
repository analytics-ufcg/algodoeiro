<?php
	header('Content-Type: text/html; charset=UTF-8');
	
	/*$url = 'http://0.0.0.0:5001/usuarios';
	$objeto = json_decode(file_get_contents($url), true);
	echo "<pre>";
	var_dump($objeto['login']);
	echo "</pre>";*/


		$loginUrl = 'http://0.0.0.0:5001/usuarios';

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_URL,$loginUrl);
		$result=curl_exec($ch);
		curl_close($ch);
		var_dump(json_decode($result));

?>