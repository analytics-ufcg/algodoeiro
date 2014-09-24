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
var mudaSenhaURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/alterar_senha/"

function estaLogado(usuarioLogin, passwordLogin){
    if (usuarioLogin == "" || passwordLogin == ""){
        usuarioLogin = "a";
        passwordLogin = "a"
    }

    var logado = readJSON(loginURL + usuarioLogin + "/" + passwordLogin);

    return typeof(logado) !== "undefined" && logado[0]["usuario"] == "True";
}

function mudaSenha(usuario, senhaAtual, novaSenha){
    var respostaOK;

    $.ajax({
        url: mudaSenhaURL + usuario + "/" + senhaAtual + "/" + novaSenha,
        type: 'GET',
        async: false
    }).done(function(data, textStatus, errorThrown) {
        respostaOK = true;
    }).fail(function () {
        respostaOK = false;
    });

    return respostaOK;
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

function parseURLParams(url) {
    var queryStart = url.indexOf("?") + 1,
        queryEnd   = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") {
        return;
    }

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=");
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) {
            parms[n] = [];
        }

        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}
