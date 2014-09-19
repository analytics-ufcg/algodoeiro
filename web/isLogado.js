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

var usuario = getCookie("usuarioLogin");
var senha = getCookie("passwordLogin");

if (estaLogado(usuario, senha)){
} else {

	alert("Acesso restrito. Por favor faça o login.");
	window.location.assign("index.html");
}	