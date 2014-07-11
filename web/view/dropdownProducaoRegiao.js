function ddwProduRegiao_dropdownAno(anos) {

    function format(item) {
        return item.ano; // TEM QUE MODIFICAR DEPOIS DE AJEITAR GAMBIARRA
    }

    $("#dropdown_ano_produ_regioes").select2 ({
        minimumResultsForSearch: -1,
        data: {results: anos, text: 'ano'},
        formatSelection: format,
        formatResult: format
    });

    $("#dropdown_ano_produ_regioes").select2('val', _.last(anos).id);

}