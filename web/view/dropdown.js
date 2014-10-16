function dropdownRegiao(selectorRegiao,regioes) {
 
    /*  Biblioteca select2 utiliza por padrão um atributo "text" como valor a ser mostrado no dropdown 
     *  como o json usado não possui esse atributo, usamos essa função para escolher o atributo "nome_agricultor"
     *  como valor a ser mostrado.
     */
    function format(regiao) {
        //var bandeiraHtml = getHTMLBandeira(regiao);
        //return  bandeiraHtml + regiao.regiao;
        return regiao.regiao;
    }


    selectorRegiao.select2({
        minimumResultsForSearch: -1, // remove searchbox
        placeholder: "first", // inicializa dropdown com primeiro valor
        data: { results: regioes, text: 'regiao' },
        formatSelection: format,
        formatResult: format
    });

    selectorRegiao.select2('val', '1');

    function getHTMLBandeira(regiao) {
        return "<img class='bandeira' src='img/bandeiras/" + regiao.regiao + ".png'/> ";
    }
}

function dropdownAgricultor(agricultores, selectorAgricultor) {
    /*  Biblioteca select2 utiliza por padrão um atributo "text" como valor a ser mostrado no dropdown 
     *  como o json usado não possui esse atributo, usamos essa função para escolher o atributo "nome_agricultor"
     *  como valor a ser mostrado.
     */
    function format(item) {
        return item.nome_agricultor;
    }

    selectorAgricultor.select2({
        placeholder: "first", // inicializa dropdown com primeiro valor
        data: { results: agricultores, text: 'nome_agricultor' },
        formatSelection: format,
        formatResult: format
    });

    selectorAgricultor.select2('val', agricultores[0].id);
}

function dropdownAno(anos, selectorAno) {
    function format(item) {
        return item.id;// Estava item.ano agora esta item.id pois vem como id da rest
    }

    selectorAno.select2 ({
        minimumResultsForSearch: -1, // remove searchbox
        placeholder: "first",
        data: {results: anos, text: 'id'},
        formatSelection: format,
        formatResult: format
    });

    var anos_producao = _.filter(anos, function(ano){ return ano["producao"]; });
  
    selectorAno.select2('val', _.last(anos_producao).id); // inicializa dropdown com ultimo ano
}

function dropdownTecnicas(tecnicas, selectorTecnica) {
    function format(tecnica){
        return tecnica.tecnica;
    }

    selectorTecnica.select2({
        data: {results: tecnicas, text: 'tecnica'},
        formatSelection: format,
        formatResult: format,
        multiple: true,
        closeOnSelect: false,
        width: "45%"
    });
}