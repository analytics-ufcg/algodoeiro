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
var loginURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/login/"

function estaLogado(usuarioLogin, passwordLogin){
    if (usuarioLogin == "" || passwordLogin == ""){
        usuarioLogin = "a";
        passwordLogin = "a"
    }

    var logado = readJSON(loginURL + usuarioLogin + "/" + passwordLogin);

    return typeof(logado) !== "undefined" && logado[0]["usuario"] == "True";
}


function readJSON(url){
	var dataframe;

	$.ajax({
        url : url,
        type : 'GET',
        async: false,
        dataType : 'json',
        success: function(data) { 
        	console.log("success ajax!");
        	dataframe = data;
         },                                                                                                                                                                                       
       error: function(xhr, status, error) {
          var err = eval("(" + xhr.responseText + ")");
          console.log(err.Message);
        }
    });

	return dataframe;
}