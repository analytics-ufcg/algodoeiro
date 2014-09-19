var usuarioLogin, passwordLogin;

$(document).ready(function() {
	$("#se_logar_form").on("submit", function (event) {
		event.preventDefault();
		seLogarIndex();
	});

	$("#nova_senha_form").on("submit", function (event) {
		event.preventDefault();
		novaSenha();
	});
});

function seLogarIndex(){
	usuarioLogin = $("input[name='login']").val();
	passwordLogin = $("input[name='password']").val();
	document.cookie="usuarioLogin="+usuarioLogin+"; path=/";
	document.cookie="passwordLogin="+passwordLogin+"; path=/";
	if (estaLogado(usuarioLogin, passwordLogin)){
		window.location.assign("algodoeiro.html");
	} else {
		alert("Usuario ou senha incorreta!");
	}
}

function novaSenha(){
	loginNovaSenha = $("input[name='loginNovaSenha']").val();
	passwordSenhaAntiga = $("input[name='senhaAntiga']").val();
	passwordNovaSenha1 = $("input[name='senhaNova1']").val();
	passwordNovaSenha2 = $("input[name='senhaNova2']").val();
	if (!estaLogado(loginNovaSenha, passwordSenhaAntiga)){
		alert("Usuario ou senha incorreta!");
	} else if (passwordNovaSenha1 !== passwordNovaSenha2){
		alert("As novas senhas não são iguais");
	} else {
		alert("Senha alterada com sucesso, se logue novamente!");
		deslogarParaIndex();
	}
}

function deslogarParaIndex(){
	//deletar cookie 
	document.cookie="usuarioLogin=a; path=/";
	document.cookie="passwordLogin=a; path=/";
	//redirecionar para o index
	window.location.assign("index.html");
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}

function direcionamentoIndex(){
	var usuario = getCookie("usuarioLogin");
	var senha = getCookie("passwordLogin");

	if (usuario == "" || senha == ""){
	    usuario = "a";
	    senha = "a"
	}

	if (estaLogado(usuario, senha)){
		window.location.assign("algodoeiro.html");
	} else {
		window.location.assign("algodoeiro_geral.html");
	}
}