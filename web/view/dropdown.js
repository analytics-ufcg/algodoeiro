function dropdownRegiao(selectorRegiao) {
    var regioes = getRegioes();   // loadJson    
    
    /*  Biblioteca select2 utiliza por padrão um atributo "text" como valor a ser mostrado no dropdown 
     *  como o json usado não possui esse atributo, usamos essa função para escolher o atributo "nome_agricultor"
     *  como valor a ser mostrado.
     */
    function format(regiao) {
        var bandeiraHtml = getHTMLBandeira(regiao);
        return  bandeiraHtml + regiao.regiao;
    }


    selectorRegiao.select2({
        minimumResultsForSearch: -1, // remove searchbox
        //placeholder: "Selecione Região",
        data: { results: regioes, text: 'regiao' },
        formatSelection: format,
        formatResult: format
    });

    selectorRegiao.select2('val', '1');

    function getHTMLBandeira(regiao) {
        return "<img class='bandeira' src='img/bandeiras/" + regiao.regiao + ".png'/> ";
    }
}

function dropdownAgricultor(agricultoresDaRegiao, selectorAgricultor) {
    /*  Biblioteca select2 utiliza por padrão um atributo "text" como valor a ser mostrado no dropdown 
     *  como o json usado não possui esse atributo, usamos essa função para escolher o atributo "nome_agricultor"
     *  como valor a ser mostrado.
     */
    function format(item) {
        return item.nome_agricultor;
    }

    selectorAgricultor.select2({
        //placeholder: "Selecione um Agricultor",
        data: { results: agricultoresDaRegiao, text: 'nome_agricultor' },
        formatSelection: format,
        formatResult: format
    });

    selectorAgricultor.select2('val', agricultoresDaRegiao[0].id);
}

function dropdownAno(anos, selectorAno) {
    function format(item) {
        return item.ano; // TEM QUE MODIFICAR DEPOIS DE REFATORAR
    }

    selectorAno.select2 ({
        minimumResultsForSearch: -1,
        data: {results: anos, text: 'ano'},
        formatSelection: format,
        formatResult: format
    });

    selectorAno.select2('val', _.last(anos).id);

}