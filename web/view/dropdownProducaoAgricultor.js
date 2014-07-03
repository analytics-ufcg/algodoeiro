function dropdownRegiao() {
    var urlRegioes = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/regioes";
    var regioes = readJSON(urlRegioes);          
    
    // select value to show in dropdown
    function format(item) {
        return item.regiao;
    }

    $("#dropdown_regiao").select2({
        placeholder: "Selecione Região",
        data: { results: regioes, text: 'regiao' },
        formatSelection: format,
        formatResult: format,
        width: "30%"
    });
    
    // regiao change listener
    $("#dropdown_regiao")
        .on("select2-selecting", function(idRegiao) { 
            onRegiaoChange(idRegiao.val);             
        });
}

function onRegiaoChange(idRegiao) {
    // populate nomeAgricultor dropdown
    dropdownAgricultor(idRegiao);
    
    // unlock agricultor dropdown
    $("#dropdown_agricultor").select2("enable", true);
}

function dropdownAgricultor(idRegiao) {
    var urlAgricultor = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultores";
    var agricultores = readJSON(urlAgricultor);    
    var agricultoresDaRegiao = _.filter(agricultores, function(agricultor) {
        return idRegiao == agricultor.id_regiao;
    });
    
    // select value to show on dropdown
    function format(item) {
        return item.nome_agricultor;
    }

    $("#dropdown_agricultor").select2({
        placeholder: "Selecione um Agricultor",
        data: { results: agricultoresDaRegiao, text: 'nome_agricultor' },
        formatSelection: format,
        formatResult: format,
        width: "50%"
    });
    
    $("#dropdown_agricultor").on("select2-selecting", function(idAgricultor){
        onAgricultorChange(idAgricultor.val, idRegiao);
    });
}

function onAgricultorChange(idAgricultor, idRegiao) {
    plotaGraficoProducaoAgricultor(idAgricultor, idRegiao);
    // Show agricultor info
    $("#info_agricultor").removeClass("hidden");
    $("#info_agricultor").addClass("visible");
}

$(document).ready(function() {
    // Inicializa dropdowns
    dropdownRegiao();
    dropdownAgricultor(1);
    
    // lock dropdown agricultor
    $("#dropdown_agricultor").select2("enable", false);

    // hide info agricultor
    $("#info_agricultor").addClass("hidden");
});
