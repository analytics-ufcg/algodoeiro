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

	<form method=POST action="sessao.php">
		Usuário: <input type="text" name="usuario" ><br/>
		Senha: <input type="password" name="pwd"><br/><br/>
		<input type="submit" value="Login">
	</form> 

	</body>
</html>