function dropdownRegiao() {
    var regioes = getRegioes();   // loadJson    
    
    // select value to show in dropdown
    function format(item) {
        return item.regiao;
    }

    $("#dropdown_regiao").select2({
        minimumResultsForSearch: -1, // remove searchbox
        placeholder: "Selecione Região",
        data: { results: regioes, text: 'regiao' },
        formatSelection: format,
        formatResult: format,
        width: "30%"
    });
}


function dropdownAgricultor(idRegiao) {
    var agricultores = getAgricultores;    
    
    var agricultoresDaRegiao = _.filter(agricultores, function(agricultor) {
        return idRegiao == agricultor.id_regiao;
    });
    
    // GAMBIARRA!! O correto é o JSON retornar os agricultores COM produção...
    var produ_agricultores = readJSON("http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor/producao/2011");
    
    // remove agricultores com producao < 0
    function removeProduMenorQueZero() {
        produ_agricultores = _.filter(produ_agricultores, function(produ) {
            return produ.producao > 0;
        });

        agricultoresDaRegiao = _.filter(agricultores, function(agricultor) {
            return _.contains(_.pluck(produ_agricultores, 'id_agricultor'), agricultor.id);
        });
    }
    
    removeProduMenorQueZero(); // chama metodo

    // FIM GAMBIARRA
    
    
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
}