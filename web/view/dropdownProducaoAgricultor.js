function dropdownRegiao() {
    var urlRegioes = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/regioes";
    var regioes = readJSON(urlRegioes);          

    function format(item) {
        return item.regiao;
    }

    $("#dropdown_regiao").select2({
        placeholder: "Selecione um Agricultor",
        data: { results: regioes, text: 'regiao' },
        formatSelection: format,
        formatResult: format,
        width: "15em"
    });

    $("#dropdown_regiao")
        .on("select2-selecting", function(e) { 
                console.log("selecting val="+ e.val+" choice = "+ JSON.stringify(e.choice));
            });
}

function dropdownAgricultor() {
    var urlAgricultor = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultores";
    var agricultor = readJSON(urlAgricultor);           

    function format(item) {
        return item.nome_agricultor;
    }

    $("#dropdown_agricultor").select2({
        placeholder: "Selecione um Agricultor",
        data: { results: agricultor, text: 'nome_agricultor' },
        formatSelection: format,
        formatResult: format,
        width: "15em"
    });
}

$(document).ready(function() {
    dropdownRegiao();
    dropdownAgricultor();
});