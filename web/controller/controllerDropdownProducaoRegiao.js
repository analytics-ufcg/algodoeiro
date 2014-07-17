// Inicializa ao carregar a pagina
$(document).ready(function() {
    contDdpProducaoRegiao_inicializaDropdown();
    
    // listener dropdown ano
    $("#dropdown_ano_produ_regioes").on("select2-selecting", function(idAno){
        contDdpProducaoRegiao_onAnoChange(idAno.val);
    });

});

function contDdpProducaoRegiao_inicializaDropdown(){
    // Inicializa dropdowns
    //DEIXAR AUTOMATICO
    var anos = [{id:2010,ano:"2010"},{id:2011,ano:"2011"}];
    var selectorAno = $("#dropdown_ano_produ_regioes");
    dropdownAno(anos, selectorAno);
    var idAnoAtual = $("#dropdown_ano_produ_regioes").select2("val");
    contDdpProducaoRegiao_onAnoChange(idAnoAtual);
}


function contDdpProducaoRegiao_onAnoChange(idAno) {
    graph2(idAno); // VIEW/mainView
}

function contDdpProducaoRegiao_clearDropdown() {
    // clear data dropdown agricultor
    $("#dropdown_ano_produ_regioes").select2("data", null);
}
