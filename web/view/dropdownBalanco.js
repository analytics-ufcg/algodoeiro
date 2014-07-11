function ddwBalanco(anos) {

    function format(item) {
        return item.ano; // TEM QUE MODIFICAR DEPOIS DE AJEITAR GAMBIARRA
    }

    $("#dropdown_ano_balanco").select2 ({
        minimumResultsForSearch: -1,
        data: {results: anos, text: 'ano'},
        formatSelection: format,
        formatResult: format,
        width: "15%"
    });

    $("#dropdown_ano_balanco").select2('val', anos[0].id);

}