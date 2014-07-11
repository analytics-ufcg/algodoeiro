function dropdownRegiao() {
    var regioes = getRegioes();   // loadJson    
    
    /*  Biblioteca select2 utiliza por padrão um atributo "text" como valor a ser mostrado no dropdown 
     *  como o json usado não possui esse atributo, usamos essa função para escolher o atributo "nome_agricultor"
     *  como valor a ser mostrado.
     */
    function format(item) {
        return item.regiao;
    }

    $("#dropdown_regiao").select2({
        minimumResultsForSearch: -1, // remove searchbox
        //placeholder: "Selecione Região",
        data: { results: regioes, text: 'regiao' },
        formatSelection: format,
        formatResult: format
    });

    $("#dropdown_regiao").select2('val', '1');
}

function dropdownAgricultor(agricultoresDaRegiao) {    
    /*  Biblioteca select2 utiliza por padrão um atributo "text" como valor a ser mostrado no dropdown 
     *  como o json usado não possui esse atributo, usamos essa função para escolher o atributo "nome_agricultor"
     *  como valor a ser mostrado.
     */
    function format(item) {
        return item.nome_agricultor;
    }

    $("#dropdown_agricultor").select2({
        //placeholder: "Selecione um Agricultor",
        data: { results: agricultoresDaRegiao, text: 'nome_agricultor' },
        formatSelection: format,
        formatResult: format
    });

    $("#dropdown_agricultor").select2('val', agricultoresDaRegiao[0].id);
}

function dropdownAno(anos) {

    function format(item) {
        return item.ano; // TEM QUE MODIFICAR DEPOIS DE REFATORAR
    }

    $("#dropdown_ano").select2 ({
        minimumResultsForSearch: -1,
        data: {results: anos, text: 'ano'},
        formatSelection: format,
        formatResult: format
    });

    $("#dropdown_ano").select2('val', anos[0].id);

}