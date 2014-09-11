//Carrega Dropdown Admin
//======================================================================
function loadDropDownProducaoAgricultoresJitterAdmin(){
    var idAgricultorAtual, idAnoAtual;
    inicializaDropdownProducaoJitter();

    // listener dropdown agricultor
    $("#dropdown_agricultor_producao").on("select2-selecting", function(idAgricultor) {
        idAgricultorAtual = idAgricultor.val;
        onAgricultorChangeProducao(idAgricultorAtual);
    });

    // listener dropdown agricultor
    $("#dropdown_ano_producao").on("select2-selecting", function(idAno) {
        idAgricultorAtual = $("#dropdown_agricultor_producao").select2("val");

        onAnoChangeProducaoDosAgricultores(idAgricultorAtual, idAno.val);
    });
    
}

function inicializaDropdownProducaoJitter() {
    var selectorAgricultor = $("#dropdown_agricultor_producao") // jquery selector para div dropdown agricultor
    var agricultores = getProdutorAlgodao();

    // clear data dropdown agricultor
    selectorAgricultor.select2("data", null);

    // populate nomeAgricultor dropdown
    dropdownAgricultor(agricultores, selectorAgricultor);
    // VIEW
    //var idAgricultor = selectorAgricultor.select2("val");

    onAgricultorChangeProducao(agricultores[0].id);
}

function onAgricultorChangeProducao(idAgricultor) {
    var selectorAno = $("#dropdown_ano_producao"); // jquery selector para div dropdown ano
    var anos = getAnosProduzidos(idAgricultor);

    // clear dropdown ano
    selectorAno.select2("data", null);
    
    dropdownAno(anos, selectorAno);

    var idAnoAtual = selectorAno.select2("val");
    onAnoChangeProducaoDosAgricultores(idAgricultor, idAnoAtual);
}

function onAnoChangeProducaoDosAgricultores(idAgricultorAtual, idAno) {
    plotGraficoProducaoRegiao(idAgricultorAtual, idAno); // VIEW
}
//======================================================================


//Carrega Dropdown para o publico em geral
//======================================================================
function loadDropDownProducaoAgricultoresJitterGeral(){
    ProducaoAgricultoresJitterGeral_inicializaDropdown();
    
    // listener dropdown ano
    $("#dropdown_ano_producao").on("select2-selecting", function(idAno){
        ProducaoAgricultoresJitterGeral_onAnoChange(idAno.val);
    });

}

function ProducaoAgricultoresJitterGeral_inicializaDropdown(){
    // Inicializa dropdowns
    //DEIXAR AUTOMATICO
    var anos = getAnos();
    var selectorAno = $("#dropdown_ano_producao");
    dropdownAno(anos, selectorAno);
    var idAnoAtual = $("#dropdown_ano_producao").select2("val");
    ProducaoAgricultoresJitterGeral_onAnoChange(idAnoAtual);
}


function ProducaoAgricultoresJitterGeral_onAnoChange(idAno) {
    plotGraficoProducaoRegiao(null, idAno); // VIEW/mainView
}
//======================================================================