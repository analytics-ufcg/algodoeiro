function ddwProduRegiao_dropdownTecnicas(){
	var ddwSelector = $("#dropdown_tecnicas_produtividade_tecnicas");
	// var tecnicas = getTecnicas(); Adicionar em getJson quando API estiver no ar

	// essa variavel não deve existir, os dados devem vir como parametro
	var tecnicasAgricultor = [{"tecnica": "Preparo do solo com Trator e Grade", "id": 19}, {"tecnica": "Desbaste", "id": 20}];

	function format(tecnicas) {
        return tecnicas.tecnica;
    }

    ddwSelector.select2 ({
        data: {results: tecnicasAgricultor, text: 'tecnica'},
        minimumResultsForSearch: -1,
        multiple: true,
        closeOnSelect: false,
        formatSelection: format,
        formatResult: format,
        width: "30%"
    });
}

$(document).ready(function() {
	ddwProduRegiao_dropdownTecnicas();
});