//Carrega Dropdown Admin
//======================================================================
function loadDropDownProdutividadeAgricultores(){
    var idAgricultorAtual, idAnoAtual;
    inicializaDropdownProdutividade();

    // listener dropdown agricultor
    $("#dropdown_agricultor_produtividade").on("select2-selecting", function(idAgricultor) {
        idAgricultorAtual = idAgricultor.val;
        onAgricultorChangeProdutividade(idAgricultorAtual);
    });

    // listener dropdown agricultor
    $("#dropdown_ano_produtividade").on("select2-selecting", function(idAno) {
        idAgricultorAtual = $("#dropdown_agricultor_produtividade").select2("val");

        onAnoChangeProdutividade(idAgricultorAtual, idAno.val);
    });
    
}

function inicializaDropdownProdutividade() {
    var selectorAgricultor = $("#dropdown_agricultor_produtividade") // jquery selector para div dropdown agricultor
    var agricultores = getProdutorAlgodao();

    // clear data dropdown agricultor
    selectorAgricultor.select2("data", null);

    // populate nomeAgricultor dropdown
    dropdownAgricultor(agricultores, selectorAgricultor);
    // VIEW
    //var idAgricultor = selectorAgricultor.select2("val");

    onAgricultorChangeProdutividade(agricultores[0].id);
}

function onAgricultorChangeProdutividade(idAgricultor) {
    var selectorAno = $("#dropdown_ano_produtividade"); // jquery selector para div dropdown ano
    var anos = getAnosProduzidos(idAgricultor);

    // clear dropdown ano
    selectorAno.select2("data", null);
    
    dropdownAno(anos, selectorAno);

    var idAnoAtual = selectorAno.select2("val");
    onAnoChangeProdutividade(idAgricultor, idAnoAtual);
}

function onAnoChangeProdutividade(idAgricultorAtual, idAno) {
    plotGraficoProdutividadeRegiao(idAgricultorAtual, idAno); // VIEW
}
//======================================================================


//Carrega Dropdown para o publico em geral
//======================================================================
function loadDropDownProdutividadeAgricultoresGeral(){
    ProdutividadeAgricultoresGeral_inicializaDropdown();
    
    // listener dropdown ano
    $("#dropdown_ano_produtividade").on("select2-selecting", function(idAno){
        ProdutividadeAgricultoresGeral_onAnoChange(idAno.val);
    });

}

function ProdutividadeAgricultoresGeral_inicializaDropdown(){
    // Inicializa dropdowns
    //DEIXAR AUTOMATICO
    var anos = getAnos();
    var selectorAno = $("#dropdown_ano_produtividade");
    dropdownAno(anos, selectorAno);
    var idAnoAtual = $("#dropdown_ano_produtividade").select2("val");
    ProdutividadeAgricultoresGeral_onAnoChange(idAnoAtual);
}


function ProdutividadeAgricultoresGeral_onAnoChange(idAno) {
     plotGraficoProdutividadeRegiao(null, idAno);// VIEW/mainView
}
//======================================================================