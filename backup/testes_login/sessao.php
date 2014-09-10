<?php session_start("logged"); ?>
<?php

	if (!empty($_POST["usuario"]) && !empty($_POST["pwd"])) {
		$_SESSION["usuario"] = $_POST["usuario"];
		$_SESSION["pwd"] = $_POST["pwd"];
	} else {
		echo "Não foi possível efetuar o login.";
	}
?>

<!DOCTYPE html>
<html lang="pt">

	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="description" content="">
		<meta name="author" content="">

		<title>Home</title>
	</head>

	<body>

	</body>
</html>
