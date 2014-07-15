function dropdownRegiaoProdutividade() {
    var regioes = getRegioes();   // loadJson    
    
    // select value to show in dropdown
    function format(item) {
        return item.regiao;
    }

    $("#dropdown_regiao_produtividade").select2({
        minimumResultsForSearch: -1, // remove searchbox
        //placeholder: "Selecione Região",
        data: { results: regioes, text: 'regiao' },
        formatSelection: format,
        formatResult: format
    });
    $("#dropdown_regiao_produtividade").select2('val', '1');
}


function dropdownAgricultorProdutividade(agricultoresDaRegiao) {    
    /*  Biblioteca select2 utiliza por padrão um atributo "text" como valor a ser mostrado no dropdown 
     *  como não temos usamos essa função para escolher o atributo "nome_agricultor" como valor a ser
     *  mostrado.
     */
    function format(item) {
        return item.nome_agricultor;
    }

    $("#dropdown_agricultor_produtividade").select2({
        //placeholder: "Selecione um Agricultor",
        data: { results: agricultoresDaRegiao, text: 'nome_agricultor' },
        formatSelection: format,
        formatResult: format
    });
    $("#dropdown_agricultor_produtividade").select2('val', agricultoresDaRegiao[0].id);
}

function dropdownAnoProdutividade(anos) {

    
    function format(item) {
        return item.ano; // TEM QUE MODIFICAR DEPOIS DE AJEITAR API/REST
    }

    $("#dropdown_ano_produtividade").select2 ({
        minimumResultsForSearch: -1,
        data: {results: anos, text: 'ano'},
        formatSelection: format,
        formatResult: format
    });

    $("#dropdown_ano_produtividade").select2('val', _.last(anos).id);

}