<?php session_start("logged"); ?>
<?php

	echo "Login: " . $_POST["usuario"] . "<br/>";
	echo " Senha: " . $_POST["pwd"] . "<br/>";

	$apiUrl = 'http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/usuarios';	
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$apiUrl);
	$result=curl_exec($ch);
	curl_close($ch);
	$data = json_decode($result, true);

	//var_dump($data);	

	echo "Login Banco: " . $data["login"] . " Senha Banco: " . $data["senha"];

	/*if (!empty($_POST["usuario"]) && !empty($_POST["pwd"])) {
		if ($_POST["usuario"] === $data->{'login'} && $_POST["pwd"]) === $data->{"pwd"}) {// strcmp
			$_SESSION["usuario"] = $_POST["usuario"];
			$_SESSION["isAdmin"] = true;
			echo "Im logged!";
		} else {
			echo "Login inválido, tente novamente";
		}
	} else {
		echo "Não foi possível efetuar o login.";
	}*/
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
		<?php
			echo "<br/> O usuário - " . $_SESSION["usuario"] . " - está logado no momento";
		?>
	</body>
</html>
