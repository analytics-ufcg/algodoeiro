function ddwBalanco_tiposBalanco(tipos) {

    function format(item) {
        return item.tipo; // TEM QUE MODIFICAR DEPOIS DE AJEITAR GAMBIARRA
    }

    $("#dropdown_balanco").select2 ({
        minimumResultsForSearch: -1,
        data: {results: tipos, text: 'tipo'},
        formatSelection: format,
        formatResult: format
    });

    $("#dropdown_balanco").select2('val', tipos[0].tipo);

}

 // Popula DropDown
    // var selectRegioes = d3.select("#droplist_tipo_balanco").append("select").attr("id", "select_tipo_balanco")
    // .on("change", function() {
    //  var valorAtual = this.options[this.selectedIndex].value;
    //     var idAnoAtual = $("#dropdown_ano_balanco").select2("val");
    //     contDdpBalanco_onAnoChange(idAnoAtual);

    //  })
    // .selectAll("option").data(opcoesBalanco).enter().append("option").attr("value", function(d) {
    //     return d;
    // }).text(function(d) {
    //     return d;
    // });


function ddwBalanco_anos(anos) {

    function format(item) {
        return item.id; // Estava item.ano agora esta item.id pois vem como id da rest
    }

    $("#dropdown_ano_balanco").select2 ({
        minimumResultsForSearch: -1,
        data: {results: anos, text: 'id'},
        formatSelection: format,
        formatResult: format
    });

    
    var anos_producao = _.filter(anos, function(ano){ return ano["producao"]; });

    $("#dropdown_ano_balanco").select2('val', _.last(anos_producao).id);

}