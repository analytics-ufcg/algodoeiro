<?php session_start("logged"); ?>
<!DOCTYPE html>
<html lang="pt">

	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="description" content="">
		<meta name="author" content="">

		<title>Login</title>
	</head>

	<body>

	<?php
			echo "<br/> O usuário - " . $_SESSION["usuario"] . " - está logado no momento";
		?>		

	</body>
</html>