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


function dropdownAgricultor(agricultoresDaRegiao) {    
    /*  Biblioteca select2 utiliza por padrão um atributo "text" como valor a ser mostrado no dropdown 
     *  como não temos usamos essa função para escolher o atributo "nome_agricultor" como valor a ser
     *  mostrado.
     */
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